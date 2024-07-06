import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEmail, IsNotEmpty } from 'class-validator';

export class EmailDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;
}
