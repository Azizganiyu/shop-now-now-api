import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class ReasonDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDefined()
  reason: string;
}
