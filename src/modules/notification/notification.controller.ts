import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
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
import { FindNotificationDto } from './dto/find-notification.dto';
import { NotificationService } from './notification.service';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { Userx } from '../../decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { NotificationResponseDto } from './responses/find-notification-response.dto';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { SendMessageDto } from './dto/notification.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('*')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiOkResponse({ status: 200, type: NotificationResponseDto })
  @HttpCode(200)
  @Post()
  async send(@Body() payload: SendMessageDto) {
    const data = await this.notificationService.message(payload);
    return {
      status: true,
      message: 'notifications successfully retrieved',
      data: data,
    };
  }

  /**
   * Retrieve all notifications for a user.
   *
   * @param user - The user requesting the notifications.
   * @param pageOptionDto - The pagination options.
   * @returns A page of notifications for the user.
   */
  @ApiOkResponse({ status: 200, type: NotificationResponseDto })
  @HttpCode(200)
  @Get()
  async findAll(@Userx() user: User, @Query() pageOptionDto: PageOptionsDto) {
    const filter: FindNotificationDto = { userId: user.id };
    const data = await this.notificationService.find(pageOptionDto, filter);
    return {
      status: true,
      message: 'notifications successfully retrieved',
      data: data,
    };
  }

  /**
   * Marks a notification as read.
   *
   * @param {string} id The ID of the notification to mark as read.
   * @returns {Promise<any>} A promise that resolves with the updated notification data.
   */
  @ApiOkResponse({ status: 200, type: ApiResponseDto })
  @HttpCode(200)
  @Get('read/:id')
  @ApiParam({ name: 'id', description: 'notification id', required: true })
  async markRead(@Userx() user: User, @Param('id') id) {
    await this.notificationService.read(id, user.id);
    return {
      status: true,
      message: 'notification successfully marked read',
    };
  }
}
