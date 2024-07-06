import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationDto {
  @IsDefined()
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  status: boolean;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  twoFactorAuthenticationCode: string;
}
