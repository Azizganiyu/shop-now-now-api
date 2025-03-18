import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { SharedModule } from 'src/shared.module';
import { AppConfigModule } from '../app-config/app-config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Delivery } from './entities/delivery.entity';
import { DeliveryItem } from './entities/delivery-item.entity';
import { OrderShipment } from '../order/entities/order-shipment.entity';

@Module({
  imports: [
    SharedModule,
    AppConfigModule,
    TypeOrmModule.forFeature([Delivery, DeliveryItem, OrderShipment]),
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService],
})
export class DeliveryModule {}
