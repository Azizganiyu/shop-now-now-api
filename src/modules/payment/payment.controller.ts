import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  InitializePaymentDto,
  VerifyPaymentDto,
} from './dto/payment-initialize.dto';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  InitializePaymentResponse,
  VerifyPaymentResponse,
} from './responses/payment-response';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

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
      message: 'initialization successful',
      data,
    };
  }
}
