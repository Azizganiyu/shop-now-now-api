import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindMedicationRequestDto {
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
