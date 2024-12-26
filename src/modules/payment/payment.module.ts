import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAuth } from './entities/payment-auth.entity';
import { PaymentRequest } from './entities/payment-request.entity';
import { OrderShipment } from '../order/entities/order-shipment.entity';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  imports: [
    SharedModule,
    TransactionModule,
    TypeOrmModule.forFeature([PaymentAuth, PaymentRequest, OrderShipment]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
