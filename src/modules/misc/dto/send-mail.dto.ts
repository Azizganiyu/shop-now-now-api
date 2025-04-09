import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  subject: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  message: string;
}
