import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SharedModule } from 'src/shared.module';
import { MiscController } from './misc.controller';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [HttpModule, SharedModule, MailModule],
  controllers: [MiscController],
})
export class MiscModule {}
