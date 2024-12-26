import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
  UserResponseDto,
} from 'src/modules/misc/responses/api-response.dto';
import { RoleResponseDto } from 'src/modules/misc/responses/role-response.dto';

class TransactionDataDto extends UserResponseDto {
  @ApiProperty({ type: RoleResponseDto })
  role: RoleResponseDto;
}

class TransactionFindDto {
  @ApiProperty({ type: [TransactionDataDto] })
  data: TransactionDataDto[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class TransactionFindResponseDto extends ApiResponseDto {
  @ApiProperty({ type: TransactionFindDto })
  data: TransactionFindDto;
}
