import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
  UserResponseDto,
} from 'src/modules/misc/responses/api-response.dto';
import { RoleResponseDto } from 'src/modules/misc/responses/role-response.dto';

class UserDataDto extends UserResponseDto {
  @ApiProperty({ type: RoleResponseDto })
  role: RoleResponseDto;
}

class UserFindDto {
  @ApiProperty({ type: [UserDataDto] })
  data: UserDataDto[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class UserFindResponseDto extends ApiResponseDto {
  @ApiProperty({ type: UserFindDto })
  data: UserFindDto;
}
