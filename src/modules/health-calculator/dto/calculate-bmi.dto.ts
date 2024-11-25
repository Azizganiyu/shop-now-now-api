import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsEnum,
} from 'class-validator';

export enum Gender {
  male = 'male',
  female = 'female',
}

export enum BMIType {
  obesity = 'Obesity',
  underweight = 'Underweight',
  overweight = 'Overweight',
  normal = 'Normal',
}

export class CalculateBmiDto {
  @IsNotEmpty()
  @IsString()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(120)
  age: number;

  @ApiProperty({ description: 'height in cm' })
  @IsNotEmpty()
  @IsNumber()
  @Min(50)
  @Max(250)
  height: number;

  @ApiProperty({ description: 'height in kg' })
  @IsNotEmpty()
  @IsNumber()
  @Min(10)
  @Max(500)
  weight: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsBoolean()
  sendEmail: boolean;
}
