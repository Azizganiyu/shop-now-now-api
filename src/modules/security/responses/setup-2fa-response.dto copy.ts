import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';

class Setup2FADto {
  @ApiProperty()
  qr: string;

  @ApiProperty()
  secret: string;
}

export class Setup2FAResponseDto extends ApiResponseDto {
  @ApiProperty({ type: Setup2FADto })
  data: Setup2FADto;
}
