import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty, Matches } from 'class-validator';

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
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long',
  })
  password: string;
}
