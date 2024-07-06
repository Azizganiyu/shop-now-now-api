import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

export class StateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  country_id: number;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  state_code: string;
}

export class StateResponseDto extends ApiResponseDto {
  @ApiProperty({ type: StateDto, isArray: true })
  data: StateDto[];
}
