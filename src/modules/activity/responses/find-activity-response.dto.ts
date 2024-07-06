import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
  UserResponseDto,
} from 'src/modules/misc/responses/api-response.dto';

class ActivityDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  event: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  ipAddress: string;

  @ApiProperty()
  object: string;

  @ApiProperty()
  objectId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

class ActivityDto {
  @ApiProperty({ type: [ActivityDataDto] })
  data: ActivityDataDto[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class ActivitiesResponseDto extends ApiResponseDto {
  @ApiProperty({ type: ActivityDto })
  data: ActivityDto;
}
