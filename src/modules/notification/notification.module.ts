import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/mail.module';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationProcessorService } from './notification-processor/notification-processor.service';
import { HelperService } from 'src/utilities/helper.service';
import { RequestContextService } from 'src/utilities/request-context.service';
import { BullModule } from '@nestjs/bull';
import { NotificationGeneratorService } from './notification-generator/notification-generator.service';
import { NotificationController } from './notification.controller';
import { User } from '../user/entities/user.entity';
import { NotificationReadReceipt } from './entities/notification-read-receipt.entity';
import { ConfigService } from '@nestjs/config';
import { OrderReceipt } from './notification-generator/order.receipt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification, NotificationReadReceipt, User]),
    MailModule,
    HttpModule,
    BullModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('redis.host'),
          port: configService.get<number>('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: process.env.BULL_NOTIFICATION_QUEUE,
    }),
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationProcessorService,
    NotificationGeneratorService,
    HelperService,
    RequestContextService,
    OrderReceipt,
  ],
  exports: [
    NotificationService,
    NotificationProcessorService,
    NotificationGeneratorService,
  ],
})
export class NotificationModule {}

//
