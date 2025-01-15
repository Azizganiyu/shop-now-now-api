import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  UseGuards,
  Query,
  Patch,
  Delete,
  Put,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/location.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Medication Request')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(@Body() createLocationDto: CreateLocationDto) {
    const data = await this.locationService.createRequest(createLocationDto);
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async findAll(@Query('includeInactive') includeInactive: number) {
    const data = await this.locationService.findAll(includeInactive);
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.locationService.findOne(id);
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Location ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateLocationDto) {
    const data = await this.locationService.update(id, request);
    return {
      status: true,
      message: 'location updated',
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
    await this.locationService.activate(id);
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
    await this.locationService.deactivate(id);
    return {
      status: true,
      message: 'location deactivated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Location ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.locationService.remove(id);
    return {
      status: true,
      message: 'location deleted',
    };
  }
}
