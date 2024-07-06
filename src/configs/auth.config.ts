import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => ({
  secret: process.env.SECRET,
  twoFactorName: process.env.TWO_FACTOR_AUTHENTICATION_APP_NAME,
}));
