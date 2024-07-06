import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SecurityService } from './security.service';
import { Userx } from '../../decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { TwoFactorAuthenticationDto } from './dto/two-factor-authentication.dto';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { Authenticate2FAResponseDto } from './responses/authenticate-2fa-response.dto';
import { Setup2FAResponseDto } from './responses/setup-2fa-response.dto copy';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@ApiTags('Security')
@Controller('settings/security')
@UseInterceptors(ClassSerializerInterceptor)
export class SecurityController {
  constructor(private securityService: SecurityService) {}

  /**
   * Changes the password for a user.
   * @param user - The authenticated user.
   * @param request - The request containing the new password.
   * @returns A message confirming the password change.
   */
  @ApiResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Post('password')
  async changePassword(
    @Userx() user: User,
    @Body() request: ChangePasswordDto,
  ) {
    await this.securityService.changePassword(request, user);
    return {
      status: true,
      message: 'password successfully changed',
    };
  }

  /**
   * Enables or disables two-factor authentication for a admin.
   * @param admin - The authenticated admin.
   * @param request - The request containing 2FA details.
   * @returns The status of the 2FA activation or deactivation along with an access token.
   */
  @ApiResponse({ status: 200, type: Authenticate2FAResponseDto })
  @HttpCode(200)
  @Roles('admin')
  @Post('2fa')
  async twoFactorAuthentication(
    @Userx() admin: User,
    @Body() request: TwoFactorAuthenticationDto,
  ) {
    const accessToken = await this.securityService.authenticate2FA(
      request,
      admin,
    );
    return {
      status: true,
      message:
        '2FA successfully ' + (request.status ? 'Activated' : 'Deactivated'),
      data: { accessToken },
    };
  }

  /**
   * Generates a new two-factor authentication secret for a admin.
   * @param admin - The authenticated admin.
   * @returns The generated 2FA secret.
   */
  @ApiResponse({ status: 200, type: Setup2FAResponseDto })
  @Roles('admin')
  @HttpCode(200)
  @Get('2fa')
  async generate(@Userx() admin: User) {
    const data = await this.securityService.generate2FA(admin);
    return {
      status: true,
      message: '2FA generated successfully',
      data,
    };
  }
}
