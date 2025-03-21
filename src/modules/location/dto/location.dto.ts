import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  @IsString()
  lgaId: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  @IsBoolean()
  canDeliver: boolean;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  deliveryPrice: number;

  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  bandId: string;
}
