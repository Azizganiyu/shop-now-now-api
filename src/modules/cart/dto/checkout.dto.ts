import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateIf,
} from 'class-validator';

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
}

export class CartCheckout {
  // @ApiProperty()
  // @IsDefined()
  // @IsNotEmpty()
  // paymentRef: string;

  // @ApiProperty()
  // @IsDefined()
  // @IsNotEmpty()
  // addressId: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  amount: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  amountToPay: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  deliveryFee: number;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsDefined()
  @IsNotEmpty()
  tax: number;

  @ApiProperty({
    enum: PaymentType,
    default: PaymentType.CARD,
  })
  @IsDefined()
  @IsNotEmpty()
  @ValidateIf((o) => o.duration)
  @IsEnum(PaymentType)
  paymentType?: PaymentType;
}
