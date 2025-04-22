import { ApiProperty } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
} from 'class-validator';
import { TransactionPurpose } from 'src/modules/transaction/dto/transaction.dto';

export enum PaymentProviders {
  PAYSTACK = 'PAYSTACK',
  MONNIFY = 'MONNIFY',
  SNN = 'SNN',
}

export class InitializePaymentDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  amount: number;

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
