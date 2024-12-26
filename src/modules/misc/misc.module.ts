import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { MiscController } from './misc.controller';
import { MailModule } from 'src/mail/mail.module';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    MailModule,
    TypeOrmModule.forFeature([User, Wallet]),
  ],
  controllers: [MiscController],
})
export class MiscModule {}
