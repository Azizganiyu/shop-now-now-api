import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
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
  @ApiPropertyOptional({ default: 'user' })
  @MaxLength(199)
  roleId?: string = 'user';

  @IsDefined()
  @ApiProperty()
  @IsEmail()
  @MaxLength(300)
  email: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
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
}
