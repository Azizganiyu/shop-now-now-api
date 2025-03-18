import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  InitializePaymentDto,
  PaymentProviders,
  VerifyPaymentDto,
} from './dto/payment-initialize.dto';
import { User } from '../user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { ActivityService } from '../activity/activity.service';
import {
  InitializePaymentDataResponse,
  VerifyPaymentDataResponse,
} from './responses/payment-response';
import { HelperService } from 'src/utilities/helper.service';
import { PaymentRequest } from './entities/payment-request.entity';
import { PaymentEntity, PaymentStatus } from '../cart/dto/checkout.dto';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { ShipmentStatus } from '../order/dto/order.dto';
import { Wallet } from '../wallet/entities/wallet.entity';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { PageDto } from 'src/utilities/pagination/page.dto';
import { PageMetaDto } from 'src/utilities/pagination/page-meta.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { Product } from '../product/entities/product.entity';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';
import { Order } from '../order/entities/order.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  TransactionPurpose,
  TransactionStatus,
} from '../transaction/dto/transaction.dto';
import { TransactionService } from '../transaction/transaction.service';
import { RedisCacheService } from 'src/utilities/redis-cache.service';

@Injectable()
export class PaymentService {
  monnifyAccessToken = '';
  depositFee = 100;

  constructor(
    @InjectRepository(OrderShipment)
    private readonly shipmentRepository: Repository<OrderShipment>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepository: Repository<PaymentRequest>,
    private configService: ConfigService,
    private httpService: HttpService,
    private activityService: ActivityService,
    private helperService: HelperService,
    private _ng: NotificationGeneratorService,
    private transactionService: TransactionService,
    private _redis: RedisCacheService,
  ) {
    this.setMonnifyAccessToken();
  }

  @Cron(CronExpression.EVERY_10_MINUTES)
  async setMonnifyAccessToken() {
    const basic = this.helperService.encodeBase64(
      `${this.configService.get<string>('monnify.key')}:${this.configService.get<string>('monnify.secret')}`,
    );
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('monnify.url')}v1/auth/login`,
          {},
          {
            headers: {
              Authorization: `Basic ${basic}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      this.monnifyAccessToken = response.data.responseBody.accessToken;
      console.log(this.monnifyAccessToken);
    } catch (error) {
      this.activityService.log(error, 'PAYSTACK INITIALIZE PAYMENT');
      throw new BadRequestException(
        error?.response?.data ?? 'Unable to initialize payment',
      );
    }
  }

  async initialize(
    request: InitializePaymentDto,
    user: User,
  ): Promise<InitializePaymentDataResponse> {
    switch (request.paymentProvider) {
      case PaymentProviders.PAYSTACK:
        return await this.initializePaystackPayment(request, user);
      case PaymentProviders.MONNIFY:
        return await this.initializeMonnifyPayment(request, user);
    }
  }

  async initializePaystackPayment(
    request: InitializePaymentDto,
    user: User,
  ): Promise<InitializePaymentDataResponse> {
    const amount = String(request.amount * 100);
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('paystack.url')}transaction/initialize`,
          { email: user.email, amount },
          {
            headers: {
              Authorization: `Bearer ${this.configService.get<string>('paystack.secret')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const payment = this.paymentRequestRepository.create({
        code: response.data.data.access_code,
        url: response.data.data.authorization_url,
        reference: response.data.data.reference,
        email: user.email,
        amount: request.amount,
        userId: user?.id,
        entity: request.entity,
        entityReference: request.entityReference,
        provider: PaymentProviders.PAYSTACK,
      });
      return await this.paymentRequestRepository.save(payment);
    } catch (error) {
      this.activityService.log(error, 'PAYSTACK INITIALIZE PAYMENT');
      throw new BadRequestException(
        error?.response?.data ?? 'Unable to initialize payment',
      );
    }
  }

  async initializeMonnifyPayment(
    request: InitializePaymentDto,
    user: User,
  ): Promise<InitializePaymentDataResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('monnify.url')}v1/merchant/transactions/init-transaction`,
          {
            amount: request.amount,
            customerName: `${user.firstName} ${user.lastName}`,
            customerEmail: user.email,
            paymentReference: request.entityReference,
            paymentDescription: 'Purchase',
            currencyCode: 'NGN',
            contractCode: this.configService.get<string>('monnify.contract'),
            // redirectUrl: 'https://my-merchants-page.com/transaction/confirm',
            paymentMethods: ['CARD', 'ACCOUNT_TRANSFER'],
          },
          {
            headers: {
              Authorization: `Bearer ${this.monnifyAccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      const payment = this.paymentRequestRepository.create({
        code: response.data.responseBody.paymentReference,
        url: response.data.responseBody.checkoutUrl,
        reference: response.data.responseBody.transactionReference,
        email: user.email,
        amount: request.amount,
        userId: user?.id,
        entity: request.entity,
        entityReference: request.entityReference,
        provider: PaymentProviders.MONNIFY,
      });
      return await this.paymentRequestRepository.save(payment);
    } catch (error) {
      this.activityService.log(error, 'MONNIFY INITIALIZE PAYMENT');
      throw new BadRequestException(
        error?.response?.data ?? 'Unable to initialize payment',
      );
    }
  }

  async verify(request: VerifyPaymentDto): Promise<VerifyPaymentDataResponse> {
    switch (request.paymentProvider) {
      case PaymentProviders.PAYSTACK:
        return await this.verifyPaystackPayment(request);
    }
  }

  async verifyPaystackPayment(
    request: VerifyPaymentDto,
  ): Promise<VerifyPaymentDataResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.configService.get<string>('paystack.url')}transaction/verify/${request.reference}`,
          {
            headers: {
              Authorization: `Bearer ${this.configService.get<string>('paystack.secret')}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      if (response.data.data.status === 'success') {
        return {
          status: 'success',
          reference: response.data.data.reference,
        };
      }
      return {
        status: response.data.data.status ?? 'failed',
        reference: response.data.data.reference,
      };
    } catch (error) {
      this.activityService.log(error, 'PAYSTACK VERIFY PAYMENT');
      throw new BadRequestException(
        error?.response?.data ?? 'Unable to verify payment',
      );
    }
  }

  async findPaymentRequestByReference(reference: string) {
    return await this.paymentRequestRepository.findOneBy({ reference });
  }

  async updatePaymentRequestStatus(id: string, status: PaymentStatus) {
    return await this.paymentRequestRepository.update(id, { status });
  }

  async markShipmentAsPaid(
    paymentRef: string,
    amountPaid: number,
    shipmentRef: string,
  ) {
    const shipment = await this.shipmentRepository.findOne({
      where: { reference: shipmentRef },
      relations: ['order', 'order.items'],
    });
    if (!shipment) {
      this.activityService.log('shipment not found');
      throw new NotFoundException(`shipment with ref ${shipmentRef} not found`);
    }
    await this.shipmentRepository.update(shipment.id, {
      amountPaid,
      paymentRef,
      paid: true,
      status: ShipmentStatus.processing,
    });
    if (shipment.pointToCredit) {
      const wallet = await this.walletRepository.findOneBy({
        userId: shipment.order.userId,
      });
      if (wallet) {
        this.walletRepository.update(wallet.id, {
          points: wallet.points + shipment.pointToCredit,
        });
      }
    }
    for (const item of shipment.order.items) {
      const product = await this.productRepository.findOneBy({
        id: item.productId,
      });
      const newStock = product.stock - item.quantity;
      await this.productRepository.update(product.id, {
        stock: newStock < 0 ? 0 : newStock,
      });
    }
    const order = await this.orderRepository.findOneOrFail({
      where: { id: shipment.orderId },
      relations: ['shipments', 'shipments.lga', 'items', 'items.product'],
    });
    await this._ng.sendOrderUpdate(order);
  }

  async findOne(id: string) {
    try {
      return await this, this.paymentRequestRepository.findOneByOrFail({ id });
    } catch (error) {
      console.log('error');
      throw new NotFoundException('payment not found');
    }
  }

  async findAll(
    pageOptionsDto: PageOptionsDto,
    filter: FindPaymentDto,
  ): Promise<PageDto<PaymentRequest>> {
    const payments = this.paymentRequestRepository
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.user', 'user')
      .andWhere('payment.status = :status', {
        status: PaymentStatus.success,
      })
      .andWhere(filter.from ? `payment.createdAt >= :fromDate` : '1=1', {
        fromDate: filter.from,
      })
      .andWhere(filter.to ? `payment.createdAt <= :toDate` : '1=1', {
        toDate: filter.to,
      })
      .andWhere(
        filter.search
          ? new Brackets((qb) => {
              qb.where('payment.reference like :reference', {
                reference: '%' + filter.search + '%',
              })
                .orWhere('user.firstName like :firstName', {
                  firstName: '%' + filter.search + '%',
                })
                .orWhere('user.lastName like :lastName', {
                  lastName: '%' + filter.search + '%',
                })
                .orWhere('user.email like :email', {
                  email: '%' + filter.search + '%',
                });
            })
          : '1=1',
      )
      .orderBy('payment.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await payments.getCount();
    const { entities } = await payments.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });
    return new PageDto(entities, pageMetaDto);
  }

  async updatePaymentWebhook(
    payment: PaymentRequest,
    amount: number,
    reference: string,
    fee: number,
  ) {
    if (payment.status === PaymentStatus.success) {
      return;
    }
    if (await this._redis.checkTransactionProcessing(reference)) return;
    await this._redis.setTransactionProcessing(reference);

    await this.updatePaymentRequestStatus(payment.id, PaymentStatus.success);
    if (payment.entity === PaymentEntity.SHIPMENT) {
      await this.markShipmentAsPaid(reference, amount, payment.entityReference);
      await this.transactionService.createDepositFromWebhook({
        amount,
        fee: this.depositFee,
        reference,
        userId: payment.userId,
        providerFee: fee,
        status: TransactionStatus.success,
        currency: 'NGN',
        paymentProvider: PaymentProviders.PAYSTACK,
        purpose: TransactionPurpose.order,
        credit: false,
      });
    } else if (payment.entity === PaymentEntity.WALLET) {
      await this.transactionService.createDepositFromWebhook({
        amount,
        fee: this.depositFee,
        reference,
        userId: payment.userId,
        providerFee: fee,
        status: TransactionStatus.success,
        currency: 'NGN',
        paymentProvider: PaymentProviders.PAYSTACK,
        purpose: TransactionPurpose.deposit,
        credit: true,
      });
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkMonnifyTransactionStatus() {
    const payments = await this.paymentRequestRepository.findBy({
      provider: PaymentProviders.MONNIFY,
      status: PaymentStatus.pending,
    });
    if (payments.length > 0) {
      for (const payment of payments) {
        try {
          const response = await firstValueFrom(
            this.httpService.get(
              `${this.configService.get<string>('monnify.url')}v1/transactions/search?paymentReference=${payment.code}`,
              {
                headers: {
                  Authorization: `Bearer ${this.monnifyAccessToken}`,
                  'Content-Type': 'application/json',
                },
              },
            ),
          );
          // const body = response.data.responseBody;
          const body = response.data.responseBody;
          console.log(body);
          if (body.content.length > 0) {
            const transaction = body.content[0];
            if (transaction.paymentStatus === 'PAID') {
              this.updatePaymentWebhook(
                payment,
                transaction.amount,
                transaction.transactionReference,
                transaction.fee,
              );
            }
          }
        } catch (error) {
          this.activityService.log(
            error?.response ?? error,
            'MONNIFY INITIALIZE PAYMENT',
          );
        }
      }
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async cancelExpiredPayment() {
    const payments = await this.paymentRequestRepository.findBy({
      provider: PaymentProviders.MONNIFY,
      status: PaymentStatus.pending,
    });
    if (payments.length > 0) {
      for (const payment of payments) {
        const dueDate = this.helperService.addToDate(payment.createdAt, 1800);
        if (this.helperService.checkExpired(dueDate)) {
          this.paymentRequestRepository.update(payment.id, {
            status: PaymentStatus.canceled,
          });
        }
      }
    }
  }
}
