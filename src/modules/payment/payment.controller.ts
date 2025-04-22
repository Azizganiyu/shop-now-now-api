import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import { InitializePaymentDto } from './dto/payment-initialize.dto';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { InitializePaymentResponse } from './responses/payment-response';
import { ActivityService } from '../activity/activity.service';
import { PaymentStatus } from '../cart/dto/checkout.dto';
import { FindPaymentDto } from './dto/find-payment.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private paymentService: PaymentService,
    private activityService: ActivityService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('*')
  @ApiOkResponse()
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(
    @Query() pageOptionDto: PageOptionsDto,
    @Query() options: FindPaymentDto,
  ) {
    const data = await this.paymentService.findAll(pageOptionDto, options);
    return {
      status: true,
      message: 'Payments successfully retrieved',
      data: data,
    };
  }

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

  @Post('webhook/paystack')
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
        await this.paymentService.updatePaymentWebhook(
          payment,
          amount,
          reference,
          fee,
        );
      } else if (body.status == PaymentStatus.failed) {
        await this.paymentService.updatePaymentRequestStatus(
          payment.id,
          PaymentStatus.failed,
        );
      }
    }
  }

  @Post('webhook/monnify')
  @HttpCode(200)
  @ApiOkResponse()
  async processMonnifyPayment(@Req() req: any) {
    await this.activityService.log(req.body);
    await this.activityService.log(req.headers);

    const event = req.body.eventType;
    const body = req.body.eventData;

    const amount = body.amountPaid / 100;
    const fee = 0;
    const reference = body.transactionReference;

    if (event == 'SUCCESSFUL_TRANSACTION' || event == 'FAILED_TRANSACTION') {
      const payment =
        await this.paymentService.findPaymentRequestByReference(reference);

      if (!payment) {
        this.activityService.log('Payment not found', 'MONNIFY WEBHOOK');
        throw new NotFoundException(
          `payment with reference ${reference} not found`,
        );
      }

      if (body.paymentStatus == 'PAID') {
        await this.paymentService.updatePaymentWebhook(
          payment,
          amount,
          reference,
          fee,
        );
      } else {
        await this.paymentService.updatePaymentRequestStatus(
          payment.id,
          PaymentStatus.failed,
        );
      }
    }
  }
}
