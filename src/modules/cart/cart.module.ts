import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { Address } from '../address/entities/address.entity';
import { PaymentModule } from '../payment/payment.module';
import { TransactionModule } from '../transaction/transaction.module';
import { Wish } from './entities/wish.entity';
import { WishItem } from './entities/wish-item.entity';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([Cart, Address, Wish, WishItem]),
    PaymentModule,
    TransactionModule,
    OrderModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
