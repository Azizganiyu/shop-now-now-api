import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { OverviewService } from './overview.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Overview')
@Controller('overview')
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async overview() {
    const data = await this.overviewService.overview();
    return {
      status: true,
      message: 'success',
      data,
    };
  }
}
