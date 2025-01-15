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
import { BannerService } from './banner.service';
import { CreateBannerDto } from './dto/banner.dto';
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
@ApiTags('Banner')
@Controller('banner')
export class BannerController {
  constructor(private readonly bannerService: BannerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(@Body() createBannerDto: CreateBannerDto) {
    const data = await this.bannerService.createRequest(createBannerDto);
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
    const data = await this.bannerService.findAll(includeInactive);
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
    const data = await this.bannerService.findOne(id);
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
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateBannerDto) {
    const data = await this.bannerService.update(id, request);
    return {
      status: true,
      message: 'banner updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    await this.bannerService.activate(id);
    return {
      status: true,
      message: 'banner activated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string) {
    await this.bannerService.deactivate(id);
    return {
      status: true,
      message: 'banner deactivated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Banner ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.bannerService.remove(id);
    return {
      status: true,
      message: 'banner deleted',
    };
  }
}
