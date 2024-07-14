import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { SharedModule } from 'src/shared.module';
import { CreateUserTransaction } from 'src/utilities/transactions/create-user-transaction';
import { UserController } from './user.controller';
import { SessionService } from '../auth/session/session.service';
import { Ssions } from '../auth/entities/ssions.entity';
import { TempUser } from './entities/temp-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Ssions, TempUser]), SharedModule],
  providers: [UserService, CreateUserTransaction, SessionService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
