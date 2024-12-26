import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { PaymentRequest } from '../entities/payment-request.entity';

export class InitializePaymentDataResponse extends PaymentRequest {}

export class InitializePaymentResponse extends ApiResponseDto {
  @ApiProperty({ type: InitializePaymentDataResponse })
  data: InitializePaymentDataResponse;
}

export class VerifyPaymentDataResponse {
  @ApiProperty()
  reference: string | null;

  @ApiProperty()
  status: string;
}

export class VerifyPaymentResponse extends ApiResponseDto {
  @ApiProperty({ type: VerifyPaymentDataResponse })
  data: VerifyPaymentDataResponse;
}
