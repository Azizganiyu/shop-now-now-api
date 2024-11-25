import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindProductDto {
  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  subCategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  manufacturerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  fromPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  toPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  status?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      date.setHours(23, 59, 59, 999);
      return date;
    }
    return value;
  })
  to?: Date;
}
