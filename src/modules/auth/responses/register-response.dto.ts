import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  UserResponseDto,
} from 'src/modules/misc/responses/api-response.dto';
import { RoleResponseDto } from 'src/modules/misc/responses/role-response.dto';

class RegisterDto extends UserResponseDto {
  @ApiProperty({ type: RoleResponseDto })
  role: RoleResponseDto;
}

export class RegisterResponseDto extends ApiResponseDto {
  @ApiProperty({ type: RegisterDto })
  data: RegisterDto;
}
