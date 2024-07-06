import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { redisStore } from 'cache-manager-redis-yet';
import { CacheModule } from '@nestjs/cache-manager';
import { HelperService } from './utilities/helper.service';
import { RedisCacheService } from './utilities/redis-cache.service';
import { RequestContextService } from './utilities/request-context.service';
import { ActivityModule } from './modules/activity/activity.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    HttpModule,
    CacheModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: await redisStore({
          socket: {
            host: configService.get<string>('redis.host'),
            port: configService.get<number>('redis.port'),
          },
        }),
        ttl: configService.get<number>('redis.ttl'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('auth.secret'),
      }),
      inject: [ConfigService],
    }),
    ActivityModule,
    NotificationModule,
  ],
  providers: [HelperService, RequestContextService, RedisCacheService],
  exports: [
    JwtModule,
    HelperService,
    RequestContextService,
    ActivityModule,
    RedisCacheService,
    NotificationModule,
    HttpModule,
  ],
})
export class SharedModule {}
