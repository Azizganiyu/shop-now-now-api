import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { AddressDetails } from 'src/modules/address/dto/address-create.dto';

export enum DeliveryStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
}

export enum DeliveryServiceModes {
  sameday = 'same-day',
  immediate = 'immediate',
}

export class CreateDeliveryDto {
  @ApiProperty({
    enum: DeliveryServiceModes,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(DeliveryServiceModes)
  serviceMode: DeliveryServiceModes;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  pickupDate: Date;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  shipmentIds: string[];
}

export class EstimateDeliveryDto {
  @ApiProperty({
    enum: DeliveryServiceModes,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(DeliveryServiceModes)
  serviceMode: DeliveryServiceModes;

  @ApiProperty({ type: AddressDetails, isArray: true })
  @IsDefined()
  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  addresses: AddressDetails[];
}

export class FindDeliveryDto {
  @ApiPropertyOptional({
    enum: DeliveryStatus,
  })
  @IsOptional()
  @IsEnum(DeliveryStatus)
  status?: DeliveryStatus;

  @ApiPropertyOptional()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  from?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (value) {
      const date = new Date(value);
      date.setHours(23, 59, 59, 999);
      return date;
    }
    return value;
  })
  to?: Date;
}
