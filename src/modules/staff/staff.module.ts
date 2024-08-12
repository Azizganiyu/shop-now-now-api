import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { SharedModule } from 'src/shared.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [SharedModule, UserModule],
  controllers: [StaffController],
})
export class StaffModule {}
