import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SecurityService } from './security.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SecurityController } from './security.controller';
import { User } from '../user/entities/user.entity';
import { SharedModule } from 'src/shared.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, SharedModule],
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
