import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { FeeType } from 'src/modules/product/dto/product-create.dto';

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
  @ApiProperty({ enum: FeeType })
  @IsEnum(FeeType)
  valueType: FeeType;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  startDate: Date;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  startTime: string;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  endDate: Date;

  @IsNotEmpty()
  @IsDefined()
  @ApiProperty()
  endTime: string;
}
