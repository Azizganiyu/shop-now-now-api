import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  oldPassword: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long',
  })
  newPassword: string;
}
