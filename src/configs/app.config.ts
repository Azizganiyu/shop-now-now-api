import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME,
  supportEmail: process.env.SUPPORT_EMAIL,
  domain: process.env.DOMAIN,
  defaultAvatar: process.env.DEFAULT_AVATAR,
  environment: process.env.NODE_ENV,
  url: process.env.APP_URL,
  adminUrl: process.env.APP_ADMIN_URL,
  serverUrl: process.env.APP_SERVER_URL,
  swapTime: process.env.SWAP_TIME,
  kycDelay: process.env.KYC_DELAY_DAYS,
}));
