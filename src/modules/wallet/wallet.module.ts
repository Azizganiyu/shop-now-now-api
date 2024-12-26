import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule } from 'src/shared.module';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { CreditTransaction } from 'src/utilities/transactions/credit-transaction';
import { DebitTransaction } from 'src/utilities/transactions/debit-transaction';
import { ConfigService } from '@nestjs/config';
import { Wallet } from './entities/wallet.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, User]), SharedModule],
  providers: [
    WalletService,
    CreditTransaction,
    DebitTransaction,
    ConfigService,
  ],
  exports: [WalletService],
  controllers: [WalletController],
})
export class WalletModule {}
