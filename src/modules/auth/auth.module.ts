import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { SharedModule } from 'src/shared.module';
import { AuthService } from './auth.service';
import { SessionService } from './session/session.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ssions } from './entities/ssions.entity';
import { RoleService } from '../role/role.service';
import { Role } from '../role/entities/role.entity';
import { UserAuthController } from './auth.controller';
import { SessionController } from './session/session.controller';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MailModule,
    SharedModule,
    TypeOrmModule.forFeature([Ssions, Role, User]),
    UserModule,
  ],
  providers: [AuthService, SessionService, RoleService],
  controllers: [UserAuthController, SessionController],
  exports: [AuthService, SessionService],
})
export class AuthModule {}
