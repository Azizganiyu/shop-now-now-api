import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import authConfig from './configs/auth.config';
import appConfig from './configs/app.config';
import bullConfig from './configs/bull.config';
import mailConfig from './configs/mail.config';
import redisConfig from './configs/redis.config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MyThrottlerGuard } from './modules/auth/guards/throttler.guard';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { MyInterceptor } from './interceptors/my-interceptor';
import { JwtTwoFaStrategy } from './modules/auth/strategies/jwt-two-factor.strategy';
import { LocalStrategy } from './modules/auth/strategies/local.strategy';
import { JwtStrategy } from './modules/auth/strategies/jwt.strategy';
import { MiscModule } from './modules/misc/misc.module';
import { UserModule } from './modules/user/user.module';
import { SecurityModule } from './modules/security/security.module';
import { PassportModule } from '@nestjs/passport';
import { SharedModule } from './shared.module';
import { MailModule } from './mail/mail.module';
import { RoleModule } from './modules/role/role.module';
import { AuthModule } from './modules/auth/auth.module';
import { ApiLog } from './modules/activity/entities/api-logs.entity';
import { validate } from './configs/env.validation';
import { ormConfig } from 'datasource';
import { ProductModule } from './modules/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...ormConfig,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([ApiLog]),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 50,
      },
    ]),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [authConfig, appConfig, bullConfig, mailConfig, redisConfig],
      expandVariables: true,
      validate,
    }),
    AuthModule,
    RoleModule,
    MailModule,
    SharedModule,
    PassportModule,
    SecurityModule,
    UserModule,
    MiscModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    LocalStrategy,
    JwtTwoFaStrategy,
    {
      provide: APP_GUARD,
      useClass: MyThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: MyInterceptor,
    },
  ],
})
export class AppModule {}
