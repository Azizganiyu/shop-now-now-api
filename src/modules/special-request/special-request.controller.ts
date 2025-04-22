import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SpecialRequestService } from './special-request.service';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { User } from '../user/entities/user.entity';
import { Userx } from 'src/decorator/userx.decorator';
import { SpecialRequestDto } from './dto/special-request.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@ApiTags('Special Request')
@Controller('special-request')
@UseInterceptors(ClassSerializerInterceptor)
export class SpecialRequestController {
  constructor(private specialRequestService: SpecialRequestService) {}

  @ApiResponse({ status: 201, type: ApiResponseDto })
  @HttpCode(201)
  @Post()
  async create(@Userx() user: User, @Body() request: SpecialRequestDto) {
    await this.specialRequestService.create(request, user);
    return {
      status: true,
      message: 'Request sent successfully',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('unread-count')
  async unreadCount() {
    const data = await this.specialRequestService.getUnreadCount();
    return {
      status: true,
      message: 'unread count retreived',
      data,
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async findAll(@Query() pageOptionsdto: PageOptionsDto) {
    const data = await this.specialRequestService.findAll(pageOptionsdto);
    return {
      status: true,
      message: 'request retreived',
      data,
    };
  }

  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'request ID' })
  @Patch(':id/mark-read')
  async markAsRead(@Param('id') id: string) {
    await this.specialRequestService.markAsRead(id);
    return {
      status: true,
      message: 'request markAsRead',
    };
  }

  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'request ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.specialRequestService.remove(id);
    return {
      status: true,
      message: 'request deleted',
    };
  }
}
