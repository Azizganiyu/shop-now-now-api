import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { WalletService } from './wallet.service';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Wallet')
@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @ApiOkResponse({ status: 200 })
  @HttpCode(200)
  @Get('balance')
  async getBalance(@Userx() user: User) {
    const data = await this.walletService.getBalance(user.id);
    return {
      status: true,
      message: `wallets balance retrieved successfully`,
      data,
    };
  }
}
