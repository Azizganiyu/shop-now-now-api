import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Max,
  Min,
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  @Max(5)
  @Min(1)
  rating: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  comment: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  productId: string;
}
