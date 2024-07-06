import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

class TimezoneDto {
  @ApiProperty()
  zoneName: string;

  @ApiProperty()
  gmtOffset: number;

  @ApiProperty()
  gmtOffsetName: string;

  @ApiProperty()
  abbreviation: string;

  @ApiProperty()
  tzName: string;
}

class CountryDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  iso3: string;

  @ApiProperty()
  iso2: string;

  @ApiProperty()
  phone_code: string;

  @ApiProperty()
  capital: string;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  native: string;

  @ApiProperty()
  region: string;

  @ApiProperty()
  subregion: string;

  @ApiProperty({ type: [TimezoneDto] })
  timezones: TimezoneDto[];

  @ApiProperty()
  emoji: string;

  @ApiProperty()
  emojiU: string;
}

export class CountryResponseDto extends ApiResponseDto {
  @ApiProperty({ type: CountryDto, isArray: true })
  data: CountryDto[];
}
