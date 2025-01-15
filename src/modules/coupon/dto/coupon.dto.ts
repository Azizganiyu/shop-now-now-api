import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  @IsString()
  code: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  value: number;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  valueType: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  endDate: Date;
}
