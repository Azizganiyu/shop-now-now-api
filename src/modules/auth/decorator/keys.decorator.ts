import { SetMetadata } from '@nestjs/common';

export const Keys = (...keys: string[]) => SetMetadata('keys', keys);
