import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAuth } from './entities/payment-auth.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([PaymentAuth])],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
