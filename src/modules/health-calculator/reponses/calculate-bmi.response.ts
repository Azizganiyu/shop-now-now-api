import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { BMIType } from '../dto/calculate-bmi.dto';

class CalculateBmiDataResponse {
  @ApiProperty()
  bmi: number;

  @ApiProperty()
  category: BMIType;
}

export class CalculateBmiResponse extends ApiResponseDto {
  @ApiProperty({ type: CalculateBmiDataResponse })
  data: CalculateBmiDataResponse;
}
