import { Module } from '@nestjs/common';
import { HealthCalculatorController } from './health-calculator.controller';
import { BmiService } from './services/body-mass-index.service';

@Module({
  providers: [BmiService],
  controllers: [HealthCalculatorController],
})
export class HealthCalculatorModule {}
