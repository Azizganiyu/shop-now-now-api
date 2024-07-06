import { NotificationMessage } from './notification-message.dto';

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
