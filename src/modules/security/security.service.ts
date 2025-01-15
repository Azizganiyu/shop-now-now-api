import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';
import { SessionService } from '../auth/session/session.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { HelperService } from 'src/utilities/helper.service';

@Injectable()
export class SecurityService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
    private sessionService: SessionService,
    private helperService: HelperService,
  ) {}
  /**
   * Changes the password for a user (either a merchant or a user).
   * @param request - The request containing the old and new passwords.
   * @param user - The user whose password is being changed.
   */
  async changePassword(request: ChangePasswordDto, user: User) {
    user = await this.authService.validateUserLogin(
      user.email,
      request.oldPassword,
    );
    const password = await bcrypt.hash(request.newPassword, 10);
    return await this.userRepository.update(user.id, {
      password,
      changedPassword: true,
    });
  }

  /**
   * Authenticates the two-factor authentication (2FA) process for a user.
   * @param data - The 2FA data containing the authentication code and status.
   * @param user - The user attempting to authenticate 2FA.
   * @returns The access token upon successful authentication.
   */
  async authenticate2FA(data, user: User) {
    if (!user.twoFactorAuthenticationSecret) {
      throw new BadRequestException('user has not activate 2FA');
    }
    const isCodeValid =
      await this.helperService.isTwoFactorAuthenticationCodeValid(
        data.twoFactorAuthenticationCode,
        user.twoFactorAuthenticationSecret,
      );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    await this.userRepository.update(user.id, {
      twoFactorAuthentication: data.status,
    });
    const token = await this.authService.getCookieWithJwtAccessToken(
      user,
      data.status,
    );
    await this.sessionService.replaceToken(token);
    return token;
  }

  /**
   * Generates a new two-factor authentication (2FA) secret for a user.
   * @param user - The user for whom the 2FA secret is being generated.
   * @returns The QR code and secret key for the generated 2FA secret.
   */
  async generate2FA(user: User) {
    let twofa;
    if (!user.twoFactorAuthenticationSecret) {
      twofa = await this.helperService.generateTwoFactorAuthenticationSecret(
        user.email,
      );
      await this.userRepository.update(user.id, {
        twoFactorAuthenticationSecret: await this.helperService.encrypt(
          JSON.stringify(twofa),
        ),
      });
    } else {
      twofa = JSON.parse(
        await this.helperService.decrypt(user.twoFactorAuthenticationSecret),
      );
    }
    const qr = await this.helperService.pipeQrCodeStream(twofa.otpauthUrl);
    return {
      qr,
      secret: twofa.secret,
    };
  }
}
