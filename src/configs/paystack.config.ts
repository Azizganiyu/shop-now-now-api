import { registerAs } from '@nestjs/config';

export default registerAs('paystack', () => ({
  secret: process.env.PAYSTACK_SECRET,
  public: process.env.PAYSTACK_PUBLIC,
  url: process.env.PAYSTACK_URL,
}));
