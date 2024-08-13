import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { SharedModule } from 'src/shared.module';
import { OrderModule } from '../order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview } from './entities/review.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductReview]),
    SharedModule,
    OrderModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
