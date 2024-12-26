import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import {
  TransactionPurpose,
  TransactionStatus,
  TransactionType,
} from './transaction.dto';

export class FindTransactionDto {
  @ApiPropertyOptional({
    description: 'Filter by transaction status',
    enum: TransactionStatus,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  readonly status?: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Filter by transaction type',
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  readonly type?: TransactionType;

  @ApiPropertyOptional({
    description: 'Filter by transaction purpose',
    enum: TransactionPurpose,
  })
  @IsOptional()
  @IsEnum(TransactionPurpose)
  readonly purpose?: TransactionPurpose;

  @ApiPropertyOptional({ description: 'Filter by user ID' })
  @IsOptional()
  userId?: string;

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
