import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  UserResponseDto,
} from 'src/modules/misc/responses/api-response.dto';
import { RoleResponseDto } from 'src/modules/misc/responses/role-response.dto';

class LoginDto extends UserResponseDto {
  @ApiProperty({ type: RoleResponseDto })
  role: RoleResponseDto;

  @ApiProperty()
  accessToken: string;
}

export class LoginResponseDto extends ApiResponseDto {
  @ApiProperty({ type: LoginDto })
  data: LoginDto;
}
