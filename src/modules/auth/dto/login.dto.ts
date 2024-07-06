import { ApiProperty } from '@nestjs/swagger';
import { IsDefined } from 'class-validator';

export class loginDto {
  @IsDefined()
  @ApiProperty()
  email: string;

  @IsDefined()
  @ApiProperty()
  password: string;
}
