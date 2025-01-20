import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAuth } from './entities/payment-auth.entity';
import { PaymentRequest } from './entities/payment-request.entity';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { Wallet } from '../wallet/entities/wallet.entity';
import { Product } from '../product/entities/product.entity';
import { Order } from '../order/entities/order.entity';

@Module({
  imports: [
    SharedModule,
    TransactionModule,
    TypeOrmModule.forFeature([
      PaymentAuth,
      PaymentRequest,
      OrderShipment,
      Wallet,
      Product,
      Order,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
