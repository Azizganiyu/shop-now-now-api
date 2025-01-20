import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Headers,
  HttpCode,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { EmailDto } from './dto/email-verify.dto';
import { loginDto } from './dto/login.dto';
import { VerifyDto } from './dto/verify.dto';
import { Userx } from '../../decorator/userx.decorator';
import { RessetPasswordDto } from './dto/reset-password.dto';
import { JwtTwofactorGuard } from './guards/jwt-twofactor.guard';
import { TwoFactorAuthenticationCodeDto } from './dto/twoFactorAuthenticationCode.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { SessionService } from './session/session.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginResponseDto } from './responses/login-response.dto';
import { RegisterResponseDto } from './responses/register-response.dto';
import { ApiResponseDto } from '../misc/responses/api-response.dto';

@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
@Controller(['auth'])
export class UserAuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private userService: UserService,
  ) {}

  /**
   * Handles the user login process.
   *
   * @param userAgent - The user-agent header from the request.
   * @param res - The response object used to set cookies.
   * @param request - The login request body containing email and password.
   * @returns An object containing the login status, message, and user data with an access token.
   */
  @HttpCode(200)
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('login')
  async login(
    @Headers('user-agent') userAgent: string,
    @Res({ passthrough: true }) res: Response,
    @Body() request: loginDto,
  ) {
    const user = await this.authService.validateUserLogin(
      request.email,
      request.password,
    );
    const data = await this.authService.loginUser(user, userAgent);

    res.cookie('accessToken', data.accessToken, {
      sameSite: 'none',
      httpOnly: process.env.NODE === 'production',
      secure: process.env.NODE === 'production',
    });

    const xuser = await this.userService.findOne(data.id);
    xuser['accessToken'] = data.accessToken;
    return {
      status: true,
      message: 'User successfully logged in',
      data: xuser,
    };
  }

  /**
   * Handles the user registration process.
   *
   * @param request - The registration request body containing user details.
   * @returns An object containing the registration status, message, and user data.
   */
  @ApiCreatedResponse({ type: RegisterResponseDto })
  @HttpCode(201)
  @Post('register')
  async create(@Body() request: CreateUserDto) {
    const user = await this.userService.register(request);
    const data = await this.userService.findOne(user.id);
    return {
      status: true,
      message: 'registration successful',
      data,
    };
  }

  /**
   * Handles the user logout process.
   *
   * @param res - The response object used to clear cookies.
   * @returns An object containing the logout status and message.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @HttpCode(200)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.cookie('accessToken', null);
    await this.sessionService.deleteCurrentSession();
    return {
      status: true,
      message: 'User logged out',
    };
  }

  /**
   * Verifies a temporary user.
   *
   * @param {VerifyDto} request - DTO containing verification details.
   * @returns {Promise<{ status: boolean, message: string }>} Status and message.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Post('verify')
  async verify(
    @Body() request: VerifyDto,
  ): Promise<{ status: boolean; message: string }> {
    await this.userService.verifyUserEmail(request);
    return {
      status: true,
      message: 'User successfully verified',
    };
  }

  /**
   * Resends the email verification for user pre-registration.
   *
   * @param {EmailDto} request - DTO containing the email address.
   * @returns {Promise<{ status: boolean, message: string }>} Status and message.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Post('verify/resend')
  async sendEmailVerification(
    @Body() request: EmailDto,
  ): Promise<{ status: boolean; message: string }> {
    const user = await this.userService.findOneByEmail(request.email);
    await this.userService.sendVerificationMail(user);
    return {
      status: true,
      message: 'Email verification successfully sent to ' + request.email,
    };
  }

  /**
   * Handles sending a password recovery email.
   *
   * @param request - The request body containing the email address.
   * @returns An object containing the status and a message indicating the password recovery email was sent.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Post('forgot/password')
  async forgotPassword(@Body() request: EmailDto) {
    await this.authService.sendPasswordRecoveryMail(request);
    return {
      status: true,
      message: 'Password recovery mail successfully sent to ' + request.email,
    };
  }

  /**
   * Handles resetting the user's password.
   *
   * @param request - The request body containing the new password and reset token.
   * @returns An object containing the status and a message indicating the password was successfully changed.
   */
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Post('reset/password')
  async resetPassword(@Body() request: RessetPasswordDto) {
    await this.authService.resetPassword(request);
    return {
      status: true,
      message: 'Password successfully changed',
    };
  }

  /**
   * Handles two-factor authentication for user login.
   *
   * @param user - The authenticated user object provided by the JwtTwofactorGuard.
   * @param twoFactorAuthenticationCode - The two-factor authentication code from the request body.
   * @returns An object containing the authentication status, message, and user data with an access token.
   */
  @ApiOkResponse({ type: LoginResponseDto })
  @Post('2fa/authenticate')
  @HttpCode(200)
  @UseGuards(JwtTwofactorGuard)
  @ApiBearerAuth('JWT-auth')
  async authenticate(
    @Userx() user: User,
    @Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
  ) {
    const data = await this.authService.authenticate2FA(
      user,
      twoFactorAuthenticationCode,
    );
    const xuser = await this.userService.findOne(user.id);
    xuser['accessToken'] = data.accessToken;
    return {
      status: true,
      message: 'User successfully logged in',
      data: data,
    };
  }
}
