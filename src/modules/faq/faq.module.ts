import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './faq.service';
import { SharedModule } from 'src/shared.module';
import { Faq } from './entities/faq.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([Faq])],
  controllers: [FaqController],
  providers: [FaqService],
})
export class FaqModule {}
