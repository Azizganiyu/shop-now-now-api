import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { MiscController } from './misc.controller';
import { MailModule } from 'src/mail/mail.module';
import { User } from '../user/entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LGA } from '../location/entities/lga.entity';
import { MiscService } from './misc.service';
import { DeviceToken } from './entities/device-tokens.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    HttpModule,
    SharedModule,
    MailModule,
    ProductModule,
    TypeOrmModule.forFeature([User, Wallet, LGA, DeviceToken]),
  ],
  controllers: [MiscController],
  providers: [MiscService],
})
export class MiscModule {}
