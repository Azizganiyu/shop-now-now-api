import { registerAs } from '@nestjs/config';

export default registerAs('gokada', () => ({
  key: process.env.GOKADA_API_KEY,
  url: process.env.GOKADA_URL,
}));
