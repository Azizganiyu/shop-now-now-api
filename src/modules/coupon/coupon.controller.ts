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
import { CouponService } from './coupon.service';
import { CreateCouponDto } from './dto/coupon.dto';
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
@Controller('coupon')
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(@Body() createCouponDto: CreateCouponDto) {
    const data = await this.couponService.createRequest(createCouponDto);
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
  @Get()
  async findAll(@Query('includeInactive') includeInactive: number) {
    const data = await this.couponService.findAll(includeInactive);
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
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.couponService.findOne(id);
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Get('code/:code')
  async findCouponeCode(@Param('code') code: string) {
    const data = await this.couponService.findCoupon(code);
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
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: CreateCouponDto) {
    const data = await this.couponService.update(id, request);
    return {
      status: true,
      message: 'coupon updated',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @Patch('activate/:id')
  async activate(@Param('id') id: string) {
    await this.couponService.activate(id);
    return {
      status: true,
      message: 'coupon activated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @Patch('deactivate/:id')
  async deactivate(@Param('id') id: string) {
    await this.couponService.deactivate(id);
    return {
      status: true,
      message: 'coupon deactivated',
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Coupon ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.couponService.remove(id);
    return {
      status: true,
      message: 'coupon deleted',
    };
  }
}
