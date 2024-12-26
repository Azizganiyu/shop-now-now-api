import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class SpecialRequestDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  request: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;
}
