import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto, UpdateUserDto } from '../auth/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { RegisterResponseDto } from '../auth/responses/register-response.dto';
import { UserFindResponseDto } from '../user/responses/find-user-response.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { FindUserDto } from '../user/dto/find-user.dto';
import { RoleTag } from 'src/constants/roletag';
import { UserRole } from '../user/dto/user.dto';
import { NotificationGeneratorService } from '../notification/notification-generator/notification-generator.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Staff')
@Controller('staff')
export class StaffController {
  constructor(
    private readonly userService: UserService,
    private notificationGenerator: NotificationGeneratorService,
  ) {}

  @ApiOkResponse({ status: 200, type: RegisterResponseDto })
  @HttpCode(201)
  @Post()
  async addStaff(@Body() request: CreateUserDto) {
    request.roleId = UserRole.admin;
    const user = await this.userService.register(request);
    const data = await this.userService.findOne(user.id);
    await this.notificationGenerator.sendStaffWelcomeMail(
      data,
      request.password,
    );
    return {
      status: true,
      message: 'registration successful',
      data,
    };
  }

  @ApiOkResponse({ status: 200, type: UserFindResponseDto })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() pageOptionDto: PageOptionsDto,
    @Query() filter: FindUserDto,
  ) {
    filter.admin = true;
    const data = await this.userService.find(pageOptionDto, filter);
    return {
      status: true,
      message: 'Users successfully retrieved',
      data: data,
    };
  }

  @ApiOkResponse({ status: 200, type: RegisterResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'id of staff' })
  @Patch(':id')
  async updateStaff(@Param('id') id: string, @Body() request: UpdateUserDto) {
    const user = await this.userService.findOne(id);
    if (user.role.tag != RoleTag.admin) {
      throw new ForbiddenException('specified user is not an admin');
    }
    if (request.email) {
      this.userService.checkEmail(request.email, user.id);
    }
    const data = await this.userService.update(id, request);
    return {
      status: true,
      message: 'staff updated successfully',
      data,
    };
  }
}
