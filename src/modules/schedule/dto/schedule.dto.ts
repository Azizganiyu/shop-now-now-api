import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  MaxLength,
} from 'class-validator';

export class ScheduleDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  day: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  start: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  end: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  interval: number;

  @IsOptional()
  @ApiPropertyOptional()
  @ApiProperty()
  locationId: string;
}
