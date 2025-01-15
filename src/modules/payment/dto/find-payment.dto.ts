import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindPaymentDto {
  @ApiPropertyOptional({
    description: 'Filter transactions from this date',
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  from?: Date;

  @ApiPropertyOptional({
    description: 'Filter transactions up to this date',
    type: String,
    format: 'date-time',
  })
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

  @ApiPropertyOptional({
    description: 'Search query to filter transactions by related fields',
  })
  @IsOptional()
  search?: string;
}
