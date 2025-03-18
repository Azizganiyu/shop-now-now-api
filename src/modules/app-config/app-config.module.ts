import { Module } from '@nestjs/common';
import { AppConfigController } from './app-config.controller';
import { AppConfigService } from './app-config.service';
import { SharedModule } from 'src/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from './entities/app-config.entity';

@Module({
  imports: [SharedModule, TypeOrmModule.forFeature([AppConfig])],
  controllers: [AppConfigController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule {}
