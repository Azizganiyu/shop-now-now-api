import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { SessionService } from '../session/session.service';
import { RequestContextService } from 'src/utilities/request-context.service';
import { UserService } from 'src/modules/user/user.service';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private jwt: JwtService,
    configService: ConfigService,
    private sessionService: SessionService,
    private requestContext: RequestContextService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKeyProvider: async (request, jwtToken, done) => {
        this.requestContext.token = jwtToken;
        done(null, configService.get<string>('auth.secret'));
      },
    });
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      'accessToken' in req.cookies &&
      req.cookies.accessToken.length > 0
    ) {
      return req.cookies.accessToken;
    }
    return null;
  }

  /**
   * Validates a user's JWT payload and sets the appropriate request context.
   *
   * @function validate
   * @param {any} payload - The JWT payload containing user information.
   * @returns {Promise<any>} A promise resolving to the validated user data.
   * @throws {UnauthorizedException} Throws an UnauthorizedException if the user does not exist, or if the account is suspended.
   */
  async validate(payload: any): Promise<any> {
    const user: User = await this.userService.findOne(payload.user);
    if (user.isDeleted) {
      throw new UnauthorizedException('user does not exist');
    }

    //check suspended
    if (user.status == 'suspended') {
      throw new UnauthorizedException('Account suspended');
    }

    //validate session
    await this.sessionService.validateSession();

    //set role
    this.requestContext.roleTag = user.role.tag;

    if (!user.twoFactorAuthentication) {
      return {
        ...user,
      };
    }
    if (payload.isSecondFactorAuthenticated) {
      return {
        ...payload,
        ...user,
      };
    }
  }
}
