import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

export class CityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  state_id: number;

  @ApiProperty()
  state_code: string;

  @ApiProperty()
  country_id: number;

  @ApiProperty()
  country_code: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;
}

export class CityResponseDto extends ApiResponseDto {
  @ApiProperty({ type: CityDto, isArray: true })
  data: CityDto[];
}
