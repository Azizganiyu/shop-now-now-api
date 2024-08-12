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
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AddressService } from './address.service';
import { AddressResponse, AddressResponseAll } from './address-responses';
import { Userx } from 'src/decorator/userx.decorator';
import { User } from '../user/entities/user.entity';
import { CreateAddress, UpdateAddress } from './dto/address-create.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOkResponse({ type: AddressResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(@Userx() user: User) {
    const data = await this.addressService.findAll(user.id);
    return {
      status: true,
      message: 'addresses retrieved',
      data,
    };
  }

  @ApiCreatedResponse({ type: AddressResponse })
  @HttpCode(201)
  @Post()
  async create(@Body() request: CreateAddress, @Userx() user: User) {
    const data = await this.addressService.create(request, user.id);
    return {
      status: true,
      message: 'address created',
      data,
    };
  }

  @ApiOkResponse({ type: AddressResponse })
  @HttpCode(200)
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: UpdateAddress) {
    const data = await this.addressService.update(id, request);
    return {
      status: true,
      message: 'address updated',
      data,
    };
  }

  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.addressService.remove(id);
    return {
      status: true,
      message: 'address deleted',
    };
  }
}
