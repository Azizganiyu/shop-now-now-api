import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  /**
   * Validates a user's credentials.
   *
   * @function validate
   * @param {string} username - The username (email) of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<any>} A promise resolving to the user data if the credentials are valid.
   * @throws {UnauthorizedException} Throws an UnauthorizedException if the account is suspended or if the credentials are invalid.
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUserLogin(username, password);
    if (!user.status) {
      throw new UnauthorizedException('Account suspended');
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
