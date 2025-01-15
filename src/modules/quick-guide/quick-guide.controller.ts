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
import { QuickGuideService } from './quick-guide.service';
import { CreateQuickGuideDto } from './dto/quick-guide.dto';
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
@Controller('quick-guide')
export class QuickGuideController {
  constructor(private readonly quickGuideService: QuickGuideService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(@Body() createQuickGuideDto: CreateQuickGuideDto) {
    const data =
      await this.quickGuideService.createRequest(createQuickGuideDto);
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
    const data = await this.quickGuideService.findAll(includeInactive);
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
    const data = await this.quickGuideService.findOne(id);
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
  @ApiParam({ name: 'id', description: 'Quick Guide ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateQuickGuideDto) {
    const data = await this.quickGuideService.update(id, request);
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
  @ApiParam({ name: 'id', description: 'Quick Guide ID' })
  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    await this.quickGuideService.activate(id);
    return {
      status: true,
      message: 'success',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Quick Guide ID' })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string) {
    await this.quickGuideService.deactivate(id);
    return {
      status: true,
      message: 'success',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Quick Guide ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.quickGuideService.remove(id);
    return {
      status: true,
      message: 'success',
    };
  }
}
