import { Module } from '@nestjs/common';
import { MedicationRequestController } from './medication-request.controller';
import { MedicationRequestService } from './medication-request.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicationRequest } from './entity/medication-request.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([MedicationRequest])],
  controllers: [MedicationRequestController],
  providers: [MedicationRequestService],
})
export class MedicationRequestModule {}
