import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationMessage } from './notification-message.dto';
import {
  IsBoolean,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsUrl,
  ValidateNested,
} from 'class-validator';

export class MailPreference {
  appName?: string;
  domain?: string;
  supportEmail?: string;
}

export class NotificationDto {
  message: NotificationMessage;
  userId?: string;
  userShared?: boolean;
  channels: string[];
}

export class MessageAttachment {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  size: number;
}

export class SendMessageDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  all?: boolean;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  message: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  subject: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  attachment?: MessageAttachment;
}
