import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
} from 'class-validator';

class Descriptors {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;
}

export class CreateProductCategory extends Descriptors {}
export class CreateProductSubCategory extends Descriptors {}
export class CreateProductPresentation extends Descriptors {}
export class CreateProductManufacturer extends Descriptors {}
export class CreateProductPackUnit extends Descriptors {}
export class CreateProductStrengthUnit extends Descriptors {}

export class UpdateProductCategory extends Descriptors {}
export class UpdateProductSubCategory extends Descriptors {}
export class UpdateProductPresentation extends Descriptors {}
export class UpdateProductManufacturer extends Descriptors {}
export class UpdateProductPackUnit extends Descriptors {}
export class UpdateProductStrengthUnit extends Descriptors {}

export class CreateProduct {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  ingredient?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  packSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  packUnitId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  sellingPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  costPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsPositive()
  @IsNumber()
  stock?: number;

  @ApiPropertyOptional()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  subCategoryId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  presentationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  manufacturerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  image?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  strength?: number;

  @ApiPropertyOptional()
  @IsOptional()
  strengthUnitId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  sku?: string;
}

export class UpdateProduct extends CreateProduct {}