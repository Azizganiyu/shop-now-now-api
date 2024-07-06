import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FileDto {
  @ApiProperty({ format: 'binary' })
  @IsOptional()
  file?: string;
}
