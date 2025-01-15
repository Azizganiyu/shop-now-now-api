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
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ScheduleDto } from './dto/schedule.dto';
import { ScheduleService } from './schedule.service';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Roles('*')
@ApiBearerAuth('JWT-auth')
@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async createSchedule(@Body() request: ScheduleDto) {
    await this.scheduleService.save(request);
    return {
      status: true,
      message: 'Schedule added successfully',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async findAll(@Query() pageOptionsdto: PageOptionsDto) {
    const data = await this.scheduleService.findAll(pageOptionsdto);
    return {
      status: true,
      message: 'schedules retreived',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Location ID' })
  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    await this.scheduleService.activate(id);
    return {
      status: true,
      message: 'location activated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Location ID' })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string) {
    await this.scheduleService.deactivate(id);
    return {
      status: true,
      message: 'location deactivated',
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Delete(':id')
  @ApiParam({ name: 'id', description: 'Schedule ID', required: true })
  async deleteSchedule(@Param('id') id: string) {
    await this.scheduleService.delete(id);
    return {
      status: true,
      message: 'Schedule removed successfully',
    };
  }
}
