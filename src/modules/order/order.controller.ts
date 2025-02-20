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
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { OrderService } from './order.service';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { FindShipmentDto } from './dto/find-shipment.dto';
import { FindOrderDto } from './dto/find-order.dto';
import {
  OrderResponse,
  OrderResponseAll,
  ShipmentResponseAll,
} from './order-responses';
import { RoleTag } from 'src/constants/roletag';
import { ChangeOrderStatusDto } from './dto/order.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOkResponse({ type: OrderResponseAll })
  @HttpCode(200)
  @Get()
  async findOrders(
    @Userx() user: User,
    @Query() filter: FindOrderDto,
    @Query() pageOptionDto: PageOptionsDto,
  ) {
    if (user.role.tag == RoleTag.user) {
      filter.userId = user.id;
    }
    const data = await this.orderService.findOrders(filter, pageOptionDto);
    return {
      status: true,
      message: 'orders retrieved',
      data,
    };
  }

  @ApiOkResponse({ type: ShipmentResponseAll })
  @HttpCode(200)
  @Get('shipments')
  async findUserShipments(
    @Userx() user: User,
    @Query() pageOptionDto: PageOptionsDto,
    @Query() filter: FindShipmentDto,
  ) {
    if (user.role.tag == RoleTag.user) {
      filter.userId = user.id;
    }
    const data = await this.orderService.findShipment(filter, pageOptionDto);
    return {
      status: true,
      message: 'shipments retreived',
      data,
    };
  }

  @ApiOkResponse({ type: ShipmentResponseAll })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Post(':id/change-status')
  async changeOrderStatus(
    @Param('id') id: string,
    @Body() payload: ChangeOrderStatusDto,
  ) {
    const data = await this.orderService.changeStatus(id, payload.status);
    return {
      status: true,
      message: 'order status changed successfully',
      data,
    };
  }

  @ApiOkResponse({ type: ShipmentResponseAll })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Get(':id/shipments')
  async findShipments(
    @Param('id') id: string,
    @Query() pageOptionDto: PageOptionsDto,
    @Query() filter: FindShipmentDto,
  ) {
    filter.orderId = id;
    const data = await this.orderService.findShipment(filter, pageOptionDto);
    return {
      status: true,
      message: 'shipments retreived',
      data,
    };
  }

  @ApiOkResponse({ type: OrderResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Order ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.orderService.findOne(id);
    return {
      status: true,
      message: 'order retreived',
      data,
    };
  }
}
