import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from './api-response.dto';

class UploadDto {
  @ApiProperty()
  url: string;
}

export class UploadResponseDto extends ApiResponseDto {
  @ApiProperty({ type: UploadDto })
  data: UploadDto;
}
