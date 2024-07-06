import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class MyThrottlerGuard extends ThrottlerGuard {
  async getTracker(req: Request) {
    const header = req.headers['x-api-key'] ?? null;
    const ip = req.ip;
    const key = (header ?? ip) as string;
    return key;
  }
}
