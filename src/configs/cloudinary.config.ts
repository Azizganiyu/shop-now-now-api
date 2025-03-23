import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY,
  secret: process.env.CLOUDINARY_API_SECRET,
}));
