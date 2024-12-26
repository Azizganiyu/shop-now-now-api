import { Module } from '@nestjs/common';
import { SpecialRequestController } from './special-request.controller';
import { SpecialRequestService } from './special-request.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecialRequest } from './entities/special-request.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([SpecialRequest])],
  controllers: [SpecialRequestController],
  providers: [SpecialRequestService],
})
export class SpecialRequestModule {}
