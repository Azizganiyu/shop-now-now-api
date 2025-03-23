export class EmailNotification {
  subject: string;
  message: string;
  fullName?: string;
  emailAddress?: string;
  action?: string;
  url?: string;
  preference: any;
  attachments?: any[];
}

export class LocalNotification {
  title: string;
  message: string;
  image?: string;
}

export class NotificationMessage {
  mail?: EmailNotification;
  local?: LocalNotification;
}
