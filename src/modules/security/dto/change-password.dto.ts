import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  newPassword: string;
}
