import { registerAs } from '@nestjs/config';

export default registerAs('bull', () => ({
  notificationQueue: process.env.BULL_NOTIFICATION_QUEUE,
}));
