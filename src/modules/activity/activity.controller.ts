import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ActivityService } from './activity.service';
import { ActivityDto } from './dto/activity.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { Userx } from '../../decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { ActivitiesResponseDto } from './responses/find-activity-response.dto';
import { RoleTag } from 'src/constants/roletag';

@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('*')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Activity')
@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  /**
   * Retrieves all activities for the authenticated user based on the provided filters and pagination options.
   *
   * @param user - The authenticated user object obtained from the JWT token.
   * @param filter - The query parameters for filtering activities (e.g., startDate, endDate).
   * @param pageOptionsDto - The pagination options including page number and limit.
   * @returns An object containing the status, message, and retrieved activities data.
   */
  @ApiOkResponse({ type: ActivitiesResponseDto })
  @Get()
  async getAllActivity(
    @Userx() user: User,
    @Query() filter: ActivityDto,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    if (user.role.tag == RoleTag.user) {
      filter.userId = user.id;
    }
    const data = await this.activityService.findAll(filter, pageOptionsDto);
    return {
      status: true,
      message: 'Activities successfully retrieved',
      data: data,
    };
  }
}
