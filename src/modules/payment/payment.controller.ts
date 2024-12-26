import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  InitializePaymentDto,
  PaymentProviders,
  VerifyPaymentDto,
} from './dto/payment-initialize.dto';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import {
  InitializePaymentResponse,
  VerifyPaymentResponse,
} from './responses/payment-response';
import { ActivityService } from '../activity/activity.service';
import { PaymentEntity, PaymentStatus } from '../cart/dto/checkout.dto';
import { TransactionService } from '../transaction/transaction.service';
import {
  TransactionPurpose,
  TransactionStatus,
} from '../transaction/dto/transaction.dto';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  depositFee = 100;
  constructor(
    private paymentService: PaymentService,
    private activityService: ActivityService,
    private transactionService: TransactionService,
  ) {}

  @ApiOkResponse({ type: InitializePaymentResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @HttpCode(200)
  @Post('initialize')
  async initializePayment(
    @Userx() user: User,
    @Body() request: InitializePaymentDto,
  ) {
    const data = await this.paymentService.initialize(request, user);
    return {
      status: true,
      message: 'initialization successful',
      data,
    };
  }

  @ApiOkResponse({ type: VerifyPaymentResponse })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('user')
  @HttpCode(200)
  @Post('verify')
  async verifyPayment(@Userx() user: User, @Body() request: VerifyPaymentDto) {
    const data = await this.paymentService.verify(request, user);
    return {
      status: true,
      message: 'verification successful',
      data,
    };
  }

  @ApiOkResponse({ type: InitializePaymentResponse })
  @HttpCode(200)
  @Get(':id')
  @ApiParam({ name: 'PaymentId' })
  async getPayment(@Param('id') id: string) {
    const data = await this.paymentService.findOne(id);
    return {
      status: true,
      message: 'payment retreived successfully',
      data,
    };
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOkResponse()
  async processPaystackPayment(@Req() req: any) {
    await this.activityService.log(req.body);
    await this.activityService.log(req.headers);

    const event = req.body.event;
    const body = req.body.data;

    const amount = body.amount / 100;
    const fee = body.fees / 100;

    const reference = body.reference;

    if (event == 'charge.success' || event == 'charge.failed') {
      const payment =
        await this.paymentService.findPaymentRequestByReference(reference);

      if (!payment) {
        this.activityService.log('Payment not found', 'PAYSTACK WEBHOOK');
        throw new NotFoundException(
          `payment with reference ${reference} not found`,
        );
      }

      if (body.status == PaymentStatus.success) {
        await this.paymentService.updatePaymentRequestStatus(
          payment.id,
          PaymentStatus.success,
        );
        if (payment.entity === PaymentEntity.SHIPMENT) {
          await this.paymentService.markShipmentAsPaid(
            reference,
            amount,
            payment.entityReference,
          );
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
      } else if (body.status == PaymentStatus.failed) {
        await this.paymentService.updatePaymentRequestStatus(
          payment.id,
          PaymentStatus.failed,
        );
      }
    }
  }
}
