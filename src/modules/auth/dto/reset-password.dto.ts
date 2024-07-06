import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class RessetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  @IsEmail()
  email: string;

  @ApiProperty()
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  code: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  password: string;
}
