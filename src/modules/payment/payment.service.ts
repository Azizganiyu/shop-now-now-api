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
import { PaymentAuth } from './entities/payment-auth.entity';
import { Repository } from 'typeorm';
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
import { PaymentStatus } from '../cart/dto/checkout.dto';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { ShipmentStatus } from '../order/dto/order.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(OrderShipment)
    private readonly shipmentRepository: Repository<OrderShipment>,
    @InjectRepository(PaymentAuth)
    private readonly paymentAuthRepository: Repository<PaymentAuth>,
    @InjectRepository(PaymentRequest)
    private readonly paymentRequestRepository: Repository<PaymentRequest>,
    private configService: ConfigService,
    private httpService: HttpService,
    private activityService: ActivityService,
    private helperService: HelperService,
  ) {}

  async initialize(
    request: InitializePaymentDto,
    user: User,
  ): Promise<InitializePaymentDataResponse> {
    console.log('initializing payment', request.paymentProvider);
    switch (request.paymentProvider) {
      case PaymentProviders.PAYSTACK:
        return await this.initializePaystackPayment(request, user);
    }
  }

  async initializePaystackPayment(
    request: InitializePaymentDto,
    user: User,
  ): Promise<InitializePaymentDataResponse> {
    await this.checkHasAuthCharge(user.id, request.paymentProvider);
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
      console.log(response.data.data);
      const payment = this.paymentRequestRepository.create({
        code: response.data.data.access_code,
        url: response.data.data.authorization_url,
        reference: response.data.data.reference,
        email: user.email,
        amount: request.amount,
        userId: user?.id,
        entity: request.entity,
        entityReference: request.entityReference,
      });
      return await this.paymentRequestRepository.save(payment);
    } catch (error) {
      this.activityService.log(error, 'PAYSTACK INITIALIZE PAYMENT');
      throw new BadRequestException(
        error?.response?.data ?? 'Unable to initialize payment',
      );
    }
  }

  async checkHasAuthCharge(userId: string, provider: string) {
    const auth = await this.paymentAuthRepository.findOneBy({
      userId,
      provider,
    });
    if (auth) {
      throw new BadRequestException('user already has an authorized charge');
    }
  }

  async verify(
    request: VerifyPaymentDto,
    user: User,
  ): Promise<VerifyPaymentDataResponse> {
    switch (request.paymentProvider) {
      case PaymentProviders.PAYSTACK:
        return await this.verifyPaystackPayment(request, user);
    }
  }

  async verifyPaystackPayment(
    request: VerifyPaymentDto,
    user: User,
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
      console.log(response.data.data);
      if (response.data.data.status === 'success') {
        if (response.data.data.authorization?.reusable) {
          this.activityService.log(
            'creating charge auth',
            'PAYSTACK VERIFY CAHRGE AUTH',
          );
          this.createChargeAuth(
            {
              auth: response.data.data.authorization,
              email: response.data.data.customer.email,
            },
            user,
            request.paymentProvider,
          );
        }
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

  async createChargeAuth(
    data: { auth: any; email: string },
    user: User,
    provider: string,
  ) {
    switch (provider) {
      case PaymentProviders.PAYSTACK: {
        try {
          return await this.createPaystackChargeAuth(data, user);
        } catch (error) {
          this.activityService.log(
            'Unable to save card',
            'PAYSTACK CHARGE AUTH',
          );
          this.activityService.log(error, 'PAYSTACK CHARGE AUTH');
        }
      }
    }
  }

  async createPaystackChargeAuth(
    data: { auth: any; email: string },
    user: User,
  ) {
    await this.paymentAuthRepository.delete({
      userId: user.id,
      provider: PaymentProviders.PAYSTACK,
    });
    const createChargeAuth = this.paymentAuthRepository.create({
      provider: 'PaymentProviders.PAYSTACK',
      userId: user.id,
      auth: await this.helperService.encrypt(data.auth.authorization_code),
      email: data.email,
      description: await this.helperService.encrypt(
        `${data.auth.brand}...${data.auth.last4}`,
      ),
    });
    return await this.paymentAuthRepository.save(createChargeAuth);
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
    console.log(shipmentRef);
    const shipment = await this.shipmentRepository.findOne({
      where: { reference: shipmentRef },
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
  }

  async findOne(id: string) {
    try {
      return await this, this.paymentRequestRepository.findOneByOrFail({ id });
    } catch (error) {
      console.log('error');
      throw new NotFoundException('payment not found');
    }
  }
}
