import { registerAs } from '@nestjs/config';

export default registerAs('google', () => ({
  apiKey: process.env.GOOGLE_API_KEY,
}));
