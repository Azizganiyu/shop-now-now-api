import { Module } from '@nestjs/common';
import { QuickGuideController } from './quick-guide.controller';
import { QuickGuideService } from './quick-guide.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuickGuide } from './entities/quick-guide.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([QuickGuide])],
  controllers: [QuickGuideController],
  providers: [QuickGuideService],
})
export class QuickGuideModule {}
