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
import { FaqService } from './faq.service';
import { CreateFaqDto } from './dto/faq.dto';
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
@ApiTags('Faq')
@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(@Body() createFaqDto: CreateFaqDto) {
    const data = await this.faqService.createRequest(createFaqDto);
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
    const data = await this.faqService.findAll(includeInactive);
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
    const data = await this.faqService.findOne(id);
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
  @ApiParam({ name: 'id', description: 'Faq ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateFaqDto) {
    const data = await this.faqService.update(id, request);
    return {
      status: true,
      message: 'faq updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Faq ID' })
  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    await this.faqService.activate(id);
    return {
      status: true,
      message: 'faq activated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Faq ID' })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string) {
    await this.faqService.deactivate(id);
    return {
      status: true,
      message: 'faq deactivated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Faq ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.faqService.remove(id);
    return {
      status: true,
      message: 'faq deleted',
    };
  }
}
