import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { DeliveryService } from './delivery.service';
import {
  CreateDeliveryDto,
  EstimateDeliveryDto,
  FindDeliveryDto,
} from './dto/delivery.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Delivery')
@Controller('delivery')
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async find(
    @Query() filter: FindDeliveryDto,
    @Query() pageOptionDto: PageOptionsDto,
  ) {
    const data = await this.deliveryService.findAll(filter, pageOptionDto);
    return {
      status: true,
      message: 'orders retrieved',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @Post('estimate')
  async estimateDelivery(@Body() payload: EstimateDeliveryDto) {
    const data = await this.deliveryService.estimate(payload);
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
  @Post('create')
  async createDelivery(@Body() payload: CreateDeliveryDto) {
    const data = await this.deliveryService.create(payload);
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('notification')
  async updatedelivery(@Body() body: any) {
    console.log('RECEIVED NOTIFICATION', body);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log('UPDATING DELIVERY', body.order_id);
    await this.deliveryService.updateDelivery(body.order_id);
    return {
      status: true,
      message: 'success',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @ApiParam({ name: 'id', description: 'Delivery ID' })
  @HttpCode(201)
  @Patch('cancel/:id')
  async cancel(@Param('id') id: string) {
    await this.deliveryService.cancel(id);
    return {
      status: true,
      message: 'delivery canceled',
    };
  }
}
