import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Column } from 'typeorm';

export class CreateProductCategory {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional()
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  iconUrl?: string;
}

export class UpdateProductCategory extends CreateProductCategory {}

export class CreateProduct {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @Column({
    default: 10,
    nullable: true,
  })
  minOrder: number;

  @ApiProperty()
  @Column({
    default: 10,
    nullable: true,
  })
  maxOrder: number;

  @ApiPropertyOptional()
  @IsOptional()
  sellingPrice?: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  costPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  stock?: number;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  categoryId?: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  // @IsUrl()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sku?: string;
}

export class UpdateProduct extends CreateProduct {}

export enum FeeType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
}

export type BandFees = { name: string; type: FeeType; value: number };

export class CreateProductBand {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => Object)
  @ApiPropertyOptional({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        value: { type: 'number' },
      },
    },
    default: [],
  })
  fees?: BandFees[] = [];

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  minimumOrderAmount: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  sellingPricePercentage?: number;
}

export class UpdateProductBand extends CreateProductBand {}
