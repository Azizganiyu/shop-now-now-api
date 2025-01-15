import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateConfigDto {
  @ApiPropertyOptional({
    description: 'Weather status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  weatherStatus?: boolean;

  @ApiPropertyOptional({ description: 'Title of the weather status' })
  @IsOptional()
  @IsString()
  weatherTitle?: string;

  @ApiPropertyOptional({
    description: 'Body description of the weather status',
  })
  @IsOptional()
  @IsString()
  weatherBody?: string;

  @ApiPropertyOptional({
    description: 'Point status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  pointStatus?: boolean;

  @ApiPropertyOptional({ description: 'Point threshold for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointThreshold?: number;

  @ApiPropertyOptional({ description: 'Point amount for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointAmount?: number;

  @ApiPropertyOptional({ description: 'Point value for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointValue?: number;

  @ApiPropertyOptional({
    description: 'Discount status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  discountStatus?: boolean;

  @ApiPropertyOptional({ description: 'Discount threshold for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountThreshold?: number;

  @ApiPropertyOptional({ description: 'Discount value for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({
    description: 'Type of discount value (e.g., percentage or fixed amount)',
  })
  @IsOptional()
  @IsString()
  discountValueType?: string;
}
