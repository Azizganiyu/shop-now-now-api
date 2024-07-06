import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtTwofactorGuard extends AuthGuard('jwt-two-factor') {}
