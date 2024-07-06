import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
} from 'src/modules/misc/responses/api-response.dto';

class SessionDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientType: string;

  @ApiProperty()
  clientName: string;

  @ApiProperty()
  clientVersion: string;

  @ApiProperty()
  osName: string;

  @ApiProperty()
  osVersion: string;

  @ApiProperty()
  deviceType: string;

  @ApiProperty()
  deviceBrand: string;

  @ApiProperty()
  expiresAt: Date;

  @ApiProperty()
  status: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

class SessionDto {
  @ApiProperty({ type: [SessionDataDto] })
  data: SessionDataDto[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class SessionResponseDto extends ApiResponseDto {
  @ApiProperty({ type: SessionDto })
  data: SessionDto;
}
