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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductCategoryService } from '../product-services/category.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import {
  CreateProductCategory,
  UpdateProductCategory,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import {
  ProductCategoryResponse,
  ProductCategoryResponseAll,
} from '../responses/product-descriptor-response';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Category')
@Controller('product/category')
export class ProductCategoryController {
  constructor(private readonly categoryService: ProductCategoryService) {}

  /**
   * Retrieves all product categories.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the categories.
   */
  @ApiOkResponse({ type: ProductCategoryResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.categoryService.findAll();
    return {
      status: true,
      message: 'categories retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product category by ID.
   *
   * @param {string} id - The ID of the category to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the category.
   */
  @ApiOkResponse({ type: ProductCategoryResponse })
  @HttpCode(200)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.categoryService.findOne(id);
    return {
      status: true,
      message: 'category retrieved',
      data,
    };
  }

  /**
   * Creates a new product category.
   *
   * @param {CreateProductCategory} request - The request body containing the details of the new category.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created category.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductCategoryResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductCategory,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.categoryService.create(request);
    return {
      status: true,
      message: 'category created',
      data,
    };
  }

  /**
   * Updates an existing product category by ID.
   *
   * @param {string} id - The ID of the category to update.
   * @param {UpdateProductCategory} request - The request body containing the updated details of the category.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated category.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductCategoryResponse })
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductCategory,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.categoryService.update(id, request);
    return {
      status: true,
      message: 'category updated',
      data,
    };
  }

  /**
   * Activates a product category by ID.
   *
   * @param {string} id - The ID of the category to activate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(201)
  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.categoryService.activate(id);
    return {
      status: true,
      message: 'category activated',
    };
  }

  /**
   * Deactivates a product category by ID.
   *
   * @param {string} id - The ID of the category to deactivate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(201)
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.categoryService.deactivate(id);
    return {
      status: true,
      message: 'category deactivated',
    };
  }

  /**
   * Deletes a product category by ID.
   *
   * @param {string} id - The ID of the category to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.categoryService.remove(id);
    return {
      status: true,
      message: 'category deleted',
    };
  }
}
