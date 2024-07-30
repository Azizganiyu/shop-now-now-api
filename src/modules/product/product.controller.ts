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
  Put,
  Query,
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
import { CreateProduct, UpdateProduct } from './dto/product-create.dto';
import { ProductService } from './product.service';
import {
  ProductResponse,
  ProductResponseAll,
} from './responses/product-response';
import { FindProductDto } from './dto/find-product.dto';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOkResponse({ type: ProductResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() filter: FindProductDto,
    @Query() pageOptionsdto: PageOptionsDto,
  ) {
    const data = await this.productService.findAll(filter, pageOptionsdto);
    return {
      status: true,
      message: 'products retreived',
      data,
    };
  }

  @ApiOkResponse({ type: ProductResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Product ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.productService.findOne(id);
    return {
      status: true,
      message: 'product retreived',
      data,
    };
  }

  @Roles('admin')
  @ApiCreatedResponse({ type: ProductResponse })
  @HttpCode(201)
  @Post()
  async create(@Body() request: CreateProduct) {
    const data = await this.productService.create(request);
    return {
      status: true,
      message: 'product created',
      data,
    };
  }

  @Roles('admin')
  @ApiOkResponse({ type: ProductResponse })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(200)
  @Put(':id')
  async update(@Param('id') id: string, @Body() request: UpdateProduct) {
    const data = await this.productService.update(id, request);
    return {
      status: true,
      message: 'product updated',
      data,
    };
  }

  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(201)
  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    await this.productService.activate(id);
    return {
      status: true,
      message: 'product activated',
    };
  }

  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(201)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    await this.productService.deactivate(id);
    return {
      status: true,
      message: 'product activated',
    };
  }

  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Product ID' })
  @HttpCode(200)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return {
      status: true,
      message: 'product deleted',
    };
  }
}
