import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  @MinLength(3)
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  @MinLength(3)
  lastName: string;

  @IsOptional()
  @ApiPropertyOptional()
  @MaxLength(199)
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional({ default: 'user' })
  @MaxLength(199)
  roleId: string = 'user';

  @IsDefined()
  @ApiProperty()
  @IsEmail()
  @MaxLength(300)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/, {
    message:
      'Password must contain at least one uppercase letter, one number, one special character, and be at least 8 characters long',
  })
  password: string;
}

export class UpdateUserDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  @MinLength(3)
  firstName?: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  @MinLength(3)
  lastName?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @MaxLength(199)
  phone?: string;

  @IsOptional()
  @ApiPropertyOptional()
  @MaxLength(199)
  @IsEmail()
  email?: string;
}

export class UpdateAvatarDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  @MinLength(3)
  avatar: string;
}
