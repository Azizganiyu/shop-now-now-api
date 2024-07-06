import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDefined, IsNotEmpty } from 'class-validator';

export class StatusDto {
  @ApiProperty()
  @IsBoolean()
  @IsDefined()
  @IsNotEmpty()
  status: boolean;
}
