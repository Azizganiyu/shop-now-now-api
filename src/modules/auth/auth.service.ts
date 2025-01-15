import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Activity } from '../activity/entities/activity.entity';
import { ActivityService } from '../activity/activity.service';
import { EmailDto } from './dto/email-verify.dto';
import { RessetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import { SessionService } from './session/session.service';
import * as DeviceDetector from 'device-detector-js';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperService } from 'src/utilities/helper.service';
import { RequestContextService } from 'src/utilities/request-context.service';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private helperService: HelperService,
    private activityService: ActivityService,
    private configService: ConfigService,
    private sessionService: SessionService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private requestContext: RequestContextService,
    private notificationGenerator: NotificationGeneratorService,
  ) {}

  /**
   * Logs in a user and handles related actions such as sending verification emails,
   * saving sessions, logging activities, and sending login mails.
   *
   * @param user - The authenticated user object.
   * @param userAgent - The user-agent string from the login request.
   * @returns An object containing the user data and an access token after successful login.
   * @throws HttpException with status HttpStatus.EXPECTATION_FAILED if the user's email is not verified.
   */
  async loginUser(user: User, userAgent: string) {
    const deviceDetector = new DeviceDetector();
    const device = deviceDetector.parse(userAgent);

    const accessToken = this.getCookieWithJwtAccessToken(user);
    await this.sessionService.save(user.id, accessToken, device);

    //log activity
    const activity: Activity = {
      event: 'Login',
      description: `${this.helperService.getFullName(user)} Logged in at ${new Date().toISOString()}`,
      ipAddress: this.requestContext.ip,
      userId: user.id,
      object: 'user',
      objectId: user.id,
    };
    this.activityService.create(activity);

    //send login mail
    if (user.role.tag === 'admin') {
      await this.notificationGenerator.sendLoginMail({
        userId: user.id,
        channels: ['email'],
      });
    }

    return {
      ...user,
      accessToken,
    };
  }

  /**
   * Sends a password recovery email to the user with the specified email address.
   *
   * @param request - The request containing the email address to send the password recovery mail to.
   * @throws BadRequestException if no user is found with the provided email address.
   */
  async sendPasswordRecoveryMail(request: EmailDto) {
    let user: User = await this.userRepository.findOne({
      where: {
        email: request.email,
      },
    });
    if (!user) {
      throw new BadRequestException('User with this email not found');
    }

    // Update verification code
    user = await this.updateVerificationCode(user);

    // Send mail
    await this.notificationGenerator.sendPasswordRecoveryMail(
      {
        userId: user.id,
        channels: ['email'],
      },
      await this.helperService.decrypt(user.code),
    );
  }

  /**
   * Resets the user's password based on the provided reset code and email address.
   *
   * @param request - The request containing the email address, reset code, and new password.
   * @throws BadRequestException if the provided code is invalid, expired, or the user is not found.
   */
  async resetPassword(request: RessetPasswordDto) {
    const user: User = await this.userRepository.findOne({
      where: {
        email: request.email,
        code: await this.helperService.encrypt(request.code),
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid code');
    }
    const expired = this.helperService.checkExpired(user.tokenExpireAt);
    if (expired) {
      throw new BadRequestException('code expired');
    }

    // Reset user password
    const password = await bcrypt.hash(request.password, 10);
    await this.userRepository.update(user.id, { password });
    await this.clearInvalidLogin(user.id);

    // Send success mail
    await this.notificationGenerator.sendPasswordRecoverySuccessMail(
      {
        userId: user.id,
        channels: ['email'],
      },
      {
        email: user.email,
        password: request.password,
      },
    );
  }

  /**
   * Validates a user's login attempt based on the provided email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns The user object if login is successful.
   * @throws BadRequestException if the email or password is invalid, or account is suspended.
   */
  async validateUserLogin(email: string, password: string): Promise<any> {
    const user: User = await this.userRepository.findOne({
      where: {
        email,
      },
      relations: ['role'],
    });
    if (!user) {
      throw new BadRequestException('Invalid email or password');
    }
    if (user.status == 'suspended') {
      throw new UnauthorizedException('Account suspended');
    }
    if (!user.emailVerifiedAt) {
      this.notificationGenerator.sendVerificationMail(
        { channels: ['email'] },
        email,
        await this.helperService.decrypt(user.code),
      );
      throw new HttpException(
        {
          status: HttpStatus.EXPECTATION_FAILED,
          message:
            'Email not verified, a verification mail has been sent to ' +
            user.email,
        },
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    const expired = this.helperService.checkExpired(user.loginRetryTime);
    if (!expired) {
      const left = this.helperService.getTimeRemaining(user.loginRetryTime);
      const countdown = `Please wait ${left[3]} minutes, ${left[4]} seconds before you can try again`;
      throw new BadRequestException(countdown);
    }
    if (expired && user.loginAttempt > 3) {
      await this.clearInvalidLogin(user.id);
    }
    if (await bcrypt.compare(password, user.password)) {
      await this.clearInvalidLogin(user.id);
      return user;
    }
    await this.updateInvalidLogin(user);
    throw new BadRequestException('Invalid email or password');
  }

  /**
   * Clears invalid login attempts and retry time for a user.
   *
   * @param userId - The ID of the user to clear the invalid login attempts for.
   */
  async clearInvalidLogin(userId: string) {
    await this.userRepository.update(userId, {
      loginAttempt: 0,
      loginRetryTime: null,
    });
  }

  /**
   * Updates the verification code and token expiration for a user.
   *
   * @param user - The user object to update the verification code for.
   * @returns The updated user object with the new verification code and token expiration.
   */
  async updateVerificationCode(user: User) {
    await this.userRepository.update(user.id, {
      code: await this.helperService.encrypt(this.helperService.generateCode()),
      tokenExpireAt: this.helperService.setDateFuture(3600),
    });
    return await this.userRepository.findOne({
      where: { id: user.id },
      relations: ['role'],
    });
  }

  /**
   * Updates the count of invalid login attempts and retry time for a user.
   *
   * @param user - The user object to update the invalid login attempts for.
   * @returns The number of invalid login attempts after update.
   */
  async updateInvalidLogin(user: User) {
    const attempt = user.loginAttempt + 1;
    await this.userRepository.update(user.id, {
      loginAttempt: user.loginAttempt + 1,
      loginRetryTime:
        attempt > 3
          ? this.helperService.setDateFuture(1800)
          : user.loginRetryTime,
    });
    if (attempt > 3) {
      // this._authmail.lockedAccountMail(user);
    }
    return attempt;
  }

  /**
   * Generates a JWT access token for a user.
   *
   * @param user - The user object for which to generate the access token.
   * @param isSecondFactorAuthenticated - Flag indicating if the user is authenticated with 2FA.
   * @returns The JWT access token.
   */
  getCookieWithJwtAccessToken(user: User, isSecondFactorAuthenticated = false) {
    const payload = {
      user: user.id,
      role: user.roleId,
      isSecondFactorAuthenticated,
    };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('auth.secret'),
    });
    return token;
  }

  /**
   * Authenticates a user using two-factor authentication (2FA).
   *
   * @param user - The authenticated user object.
   * @param code - The two-factor authentication code from the request.
   * @returns An object containing the new access token after successful 2FA authentication.
   * @throws BadRequestException if the user has not enabled 2FA or the authentication code is wrong.
   */
  async authenticate2FA(user: User, code: string) {
    if (!user.twoFactorAuthenticationSecret || !user.twoFactorAuthentication) {
      throw new BadRequestException('This user has not enabled 2FA');
    }
    const isCodeValid =
      await this.helperService.isTwoFactorAuthenticationCodeValid(
        code,
        user.twoFactorAuthenticationSecret,
      );
    if (!isCodeValid) {
      throw new ForbiddenException('Wrong authentication code');
    }
    const accessToken = this.getCookieWithJwtAccessToken(user, true);
    await this.sessionService.replaceToken(accessToken);
    return {
      accessToken: accessToken,
    };
  }
}
