import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';

export enum PaymentProviders {
  PAYSTACK = 'PAYSTACK',
}

export class InitializePaymentDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: number;

  @ApiProperty({ enum: PaymentProviders, default: PaymentProviders.PAYSTACK })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PaymentProviders)
  paymentProvider: PaymentProviders = PaymentProviders.PAYSTACK;
}

export class VerifyPaymentDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({ enum: PaymentProviders, default: PaymentProviders.PAYSTACK })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(PaymentProviders)
  paymentProvider: PaymentProviders = PaymentProviders.PAYSTACK;
}
