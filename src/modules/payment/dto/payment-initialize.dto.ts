import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';
import { TransactionPurpose } from 'src/modules/transaction/dto/transaction.dto';

export enum PaymentProviders {
  PAYSTACK = 'PAYSTACK',
  SNN = 'SNN',
}

export class InitializePaymentDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({
    enum: PaymentProviders,
    default: PaymentProviders.PAYSTACK,
  })
  @IsOptional()
  @IsEnum(PaymentProviders)
  paymentProvider: PaymentProviders = PaymentProviders.PAYSTACK;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  entity: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  entityReference: string;
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

export interface WebhookDeposit {
  reference: string;
  userId: string;
  amount: number;
  fee: number;
  providerFee: number;
  status: string;
  currency: string;
  paymentProvider: PaymentProviders;
  purpose: TransactionPurpose;
  credit: boolean;
}

export interface ChargeWalletDto {
  reference: string;
  userId: string;
  amount: number;
  paymentProvider: PaymentProviders;
  purpose: TransactionPurpose;
}
