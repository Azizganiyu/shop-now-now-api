import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  twoFactorAuthenticationCode: string;
}
