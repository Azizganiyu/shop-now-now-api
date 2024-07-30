import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { CartResponse, CartResponseAll } from './cart-responses';
import { CreateCart, UpdateCart } from './dto/cart-create.dto';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { CartCheckout } from './dto/checkout.dto';
import { OrderResponse } from '../order/order-responses';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiOkResponse({ type: CartResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(@Userx() user: User) {
    const data = await this.cartService.findAll(user.id);
    return {
      status: true,
      message: 'carts retrieved',
      data,
    };
  }

  @ApiCreatedResponse({ type: CartResponse })
  @HttpCode(201)
  @Post()
  async create(@Body() request: CreateCart, @Userx() user: User) {
    const data = await this.cartService.create(request, user.id);
    return {
      status: true,
      message: 'cart created',
      data,
    };
  }

  @ApiOkResponse({ type: CartResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: UpdateCart) {
    const data = await this.cartService.update(id, request);
    return {
      status: true,
      message: 'cart updated',
      data,
    };
  }

  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Cart ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.cartService.remove(id);
    return {
      status: true,
      message: 'cart deleted',
    };
  }

  @ApiOkResponse({ type: OrderResponse })
  @HttpCode(200)
  @Post('checkout')
  async checkout(@Userx() user: User, @Body() request: CartCheckout) {
    const data = await this.cartService.checkout(request, user.id);
    return {
      status: true,
      message: 'checkout completed',
      data,
    };
  }
}
