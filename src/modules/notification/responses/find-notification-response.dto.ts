import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
} from 'src/modules/misc/responses/api-response.dto';

class NotificationDataDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  createdAt: Date;
}

class NotificationDto {
  @ApiProperty({ type: [NotificationDataDto] })
  data: NotificationDataDto[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class NotificationResponseDto extends ApiResponseDto {
  @ApiProperty({ type: NotificationDto })
  data: NotificationDto;
}
