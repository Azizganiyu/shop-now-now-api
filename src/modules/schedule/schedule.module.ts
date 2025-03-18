import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { SharedModule } from 'src/shared.module';
import { User } from '../user/entities/user.entity';
import { Location } from '../location/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, User, Location]), SharedModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
