import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { AddressDetails } from 'src/modules/address/dto/address-create.dto';

export class CreateConfigDto {
  @ApiPropertyOptional({
    description: 'Weather status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  weatherStatus?: boolean;

  @ApiPropertyOptional({ description: 'Title of the weather status' })
  @IsOptional()
  @IsString()
  weatherTitle?: string;

  @ApiPropertyOptional({
    description: 'Body description of the weather status',
  })
  @IsOptional()
  @IsString()
  weatherBody?: string;

  @ApiPropertyOptional({
    description: 'Point status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  pointStatus?: boolean;

  @ApiPropertyOptional({ description: 'Point threshold for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointThreshold?: number;

  @ApiPropertyOptional({ description: 'Point amount for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointAmount?: number;

  @ApiPropertyOptional({ description: 'Point value for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  pointValue?: number;

  @ApiPropertyOptional({
    description: 'Discount status of the location',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  discountStatus?: boolean;

  @ApiPropertyOptional({ description: 'Discount threshold for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountThreshold?: number;

  @ApiPropertyOptional({ description: 'Discount value for the location' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @ApiPropertyOptional({
    description: 'Type of discount value (e.g., percentage or fixed amount)',
  })
  @IsOptional()
  @IsString()
  discountValueType?: string;

  @ApiProperty({ example: 10.5, description: 'Selling price percentage' })
  @IsOptional()
  @IsNumber()
  sellingPricePercentage?: number;

  @ApiProperty({ example: 8000, description: 'Default delivery price' })
  @IsOptional()
  @IsNumber()
  defaultDeliveryPrice?: number;

  @ApiProperty({ example: ['admin@example.com'], description: 'Admin emails' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adminEmails?: string[];

  @ApiPropertyOptional({ type: AddressDetails })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDetails)
  pickupAddress?: AddressDetails;

  @ApiProperty({ example: 'Warehouse A', description: 'Pickup location name' })
  @IsOptional()
  @IsString()
  pickupName?: string;

  @ApiProperty({ example: 'pickup@example.com', description: 'Pickup email' })
  @IsOptional()
  @IsString()
  pickupEmail?: string;

  @ApiProperty({
    example: '+2348123456789',
    description: 'Pickup phone number',
  })
  @IsOptional()
  @IsString()
  pickupPhone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentProvider?: string;
}
