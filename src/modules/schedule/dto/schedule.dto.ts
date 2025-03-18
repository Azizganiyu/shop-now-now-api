import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
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
  locationId: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  bandId: string;
}

export class GetSlotDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @MaxLength(199)
  date: Date;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  @IsArray()
  bands: string[];

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  lgaId: string;
}
