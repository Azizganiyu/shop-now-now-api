import { Module } from '@nestjs/common';
import { OverviewService } from './overview.service';
import { OverviewController } from './overview.controller';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentRequest } from '../payment/entities/payment-request.entity';
import { User } from '../user/entities/user.entity';
import { Order } from '../order/entities/order.entity';
import { Product } from '../product/entities/product.entity';
import { ProductCategory } from '../product/entities/product-category.entity';
import { OrderItem } from '../order/entities/order-item.entity';

@Module({
  imports: [
    SharedModule,
    TypeOrmModule.forFeature([
      PaymentRequest,
      User,
      Order,
      Product,
      ProductCategory,
      OrderItem,
    ]),
  ],
  providers: [OverviewService],
  controllers: [OverviewController],
})
export class OverviewModule {}
