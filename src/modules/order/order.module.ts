import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderShipment } from './entities/order-shipment.entity';
import { Order } from './entities/order.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([OrderShipment, Order])],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}
