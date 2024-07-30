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
import { ProductSubCategoryService } from '../product-services/sub-category.service';
import {
  ProductSubCategoryResponse,
  ProductSubCategoryResponseAll,
} from '../responses/product-descriptor-response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import {
  CreateProductSubCategory,
  UpdateProductSubCategory,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Sub Category')
@Controller('product/sub-category')
export class ProductSubCategoryController {
  constructor(private readonly subCategoryService: ProductSubCategoryService) {}

  /**
   * Retrieve all sub-categories optionally filtered by categoryId.
   *
   * @param categoryId - Optional category ID to filter sub-categories.
   * @returns Object containing status, message, and retrieved data.
   */
  @ApiOkResponse({ type: ProductSubCategoryResponseAll })
  @HttpCode(200)
  @ApiQuery({
    name: 'categoryId',
    description: 'Filter by category ID',
    required: false,
  })
  @Get()
  async findAll(@Query('categoryId') categoryId: string) {
    const data = await this.subCategoryService.findAll(categoryId ?? null);
    return {
      status: true,
      message: 'Sub-categories retrieved',
      data,
    };
  }

  /**
   * Retrieve a single sub-category by its ID.
   *
   * @param id - ID of the sub-category to retrieve.
   * @returns Object containing status, message, and retrieved data.
   */
  @ApiOkResponse({ type: ProductSubCategoryResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Sub category ID' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.subCategoryService.findOne(id);
    return {
      status: true,
      message: 'Sub-category retrieved',
      data,
    };
  }

  /**
   * Create a new sub-category.
   *
   * @param request - Request body containing sub-category details.
   * @returns Object containing status, message, and created sub-category data.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductSubCategoryResponse })
  @HttpCode(201)
  @Post()
  async create(@Body() request: CreateProductSubCategory) {
    const data = await this.subCategoryService.create(request);
    return {
      status: true,
      message: 'Sub-category created',
      data,
    };
  }

  /**
   * Update an existing sub-category by its ID.
   *
   * @param id - ID of the sub-category to update.
   * @param request - Request body containing updated sub-category details.
   * @returns Object containing status, message, and updated sub-category data.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductSubCategoryResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Sub category ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductSubCategory,
  ) {
    const data = await this.subCategoryService.update(id, request);
    return {
      status: true,
      message: 'Sub-category updated',
      data,
    };
  }

  /**
   * Activate (enable) a sub-category by its ID.
   *
   * @param id - ID of the sub-category to activate.
   * @returns Object containing status and activation message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Sub category ID' })
  @HttpCode(200)
  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    await this.subCategoryService.activate(id);
    return {
      status: true,
      message: 'Sub-category activated',
    };
  }

  /**
   * Deactivate (disable) a sub-category by its ID.
   *
   * @param id - ID of the sub-category to deactivate.
   * @returns Object containing status and deactivation message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Sub category ID' })
  @HttpCode(200)
  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    await this.subCategoryService.deactivate(id);
    return {
      status: true,
      message: 'Sub-category deactivated',
    };
  }

  /**
   * Delete a sub-category by its ID.
   *
   * @param id - ID of the sub-category to delete.
   * @returns Object containing status and deletion message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Sub category ID' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.subCategoryService.remove(id);
    return {
      status: true,
      message: 'Sub-category deleted',
    };
  }
}
