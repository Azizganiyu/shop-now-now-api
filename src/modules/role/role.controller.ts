import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from './entities/role.entity';
import { RoleService } from './role.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth('JWT-auth')
@ApiTags('Admin Role')
@Controller('roles')
export class RoleController {
  constructor(private _role: RoleService) {}

  @ApiOkResponse({ status: 200, type: Role, isArray: true })
  @HttpCode(200)
  @ApiQuery({ name: 'tag', description: 'role tag' })
  @Get()
  async find(@Query('tag') tag: string) {
    const roles = await this._role.find(tag);
    return {
      status: true,
      message: 'Roles successfully retrieved',
      data: roles,
    };
  }
}
