import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';

export class InitializePaymentDataResponse {
  @ApiProperty()
  code: string | null;

  @ApiProperty()
  url: string | null;

  @ApiProperty()
  reference: string | null;

  @ApiProperty()
  email: string;

  @ApiProperty()
  amount: string;
}

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
