import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityService } from './activity.service';
import { Activity } from './entities/activity.entity';
import { Log } from './entities/log.entity';
import { RequestContextService } from 'src/utilities/request-context.service';
import { ActivityController } from './activity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Log])],
  controllers: [ActivityController],
  providers: [ActivityService, RequestContextService],
  exports: [ActivityService],
})
export class ActivityModule {}
