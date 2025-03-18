import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsOptional } from 'class-validator';

export class SpecialRequestDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  brand: string;

  @IsOptional()
  @ApiPropertyOptional()
  description?: string;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;
}
