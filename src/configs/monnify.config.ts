import { registerAs } from '@nestjs/config';

export default registerAs('monnify', () => ({
  secret: process.env.MONNIFY_SECRET,
  key: process.env.MONNIFY_KEY,
  url: process.env.MONNIFY_URL,
  contract: process.env.MONNIFY_CONTRACT,
}));
