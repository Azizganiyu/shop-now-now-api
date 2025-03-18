import { Optional } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty, ValidateIf } from 'class-validator';

export enum PaymentType {
  WALLET = 'WALLET',
  CARD = 'CARD',
}

export enum PaymentEntity {
  WALLET = 'WALLET',
  SHIPMENT = 'SHIPMENT',
}

export enum PaymentStatus {
  success = 'success',
  pending = 'pending',
  failed = 'failed',
  canceled = 'canceled',
}

export class CartCheckout {
  @ApiProperty({
    enum: PaymentType,
    default: PaymentType.CARD,
  })
  @IsDefined()
  @IsNotEmpty()
  @ValidateIf((o) => o.duration)
  @IsEnum(PaymentType)
  paymentType?: PaymentType;

  @ApiPropertyOptional()
  @Optional()
  couponCode: string;

  @ApiPropertyOptional()
  @Optional()
  additionalInfo: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  expectedDeliveryDate: Date;
}
