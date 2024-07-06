import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';

class Authenticate2FADto {
  @ApiProperty()
  accessToken: string;
}

export class Authenticate2FAResponseDto extends ApiResponseDto {
  @ApiProperty({ type: Authenticate2FADto })
  data: Authenticate2FADto;
}
