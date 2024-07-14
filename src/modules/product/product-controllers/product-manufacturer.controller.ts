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
import { ProductManufacturerService } from '../product-services/manufacturer.service';
import {
  ProductManufacturerResponse,
  ProductManufacturerResponseAll,
} from '../responses/product-descriptor-response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import {
  CreateProductManufacturer,
  UpdateProductManufacturer,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Manufacturer')
@Controller('product/manufacturer')
export class ProductManufacturerController {
  constructor(
    private readonly manufacturerService: ProductManufacturerService,
  ) {}

  /**
   * Retrieves all product manufacturers.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the manufacturers.
   */
  @ApiOkResponse({ type: ProductManufacturerResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.manufacturerService.findAll();
    return {
      status: true,
      message: 'manufacturers retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product manufacturer by ID.
   *
   * @param {string} id - The ID of the manufacturer to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the manufacturer.
   */
  @ApiOkResponse({ type: ProductManufacturerResponse })
  @HttpCode(200)
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.manufacturerService.findOne(id);
    return {
      status: true,
      message: 'manufacturer retrieved',
      data,
    };
  }

  /**
   * Creates a new product manufacturer.
   *
   * @param {CreateProductManufacturer} request - The request body containing the details of the new manufacturer.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created manufacturer.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductManufacturerResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductManufacturer,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.manufacturerService.create(request);
    return {
      status: true,
      message: 'manufacturer created',
      data,
    };
  }

  /**
   * Updates an existing product manufacturer by ID.
   *
   * @param {string} id - The ID of the manufacturer to update.
   * @param {UpdateProductManufacturer} request - The request body containing the updated details of the manufacturer.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated manufacturer.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductManufacturerResponse })
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductManufacturer,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.manufacturerService.update(id, request);
    return {
      status: true,
      message: 'manufacturer updated',
      data,
    };
  }

  /**
   * Activates a product manufacturer by ID.
   *
   * @param {string} id - The ID of the manufacturer to activate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(201)
  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.manufacturerService.activate(id);
    return {
      status: true,
      message: 'manufacturer activated',
    };
  }

  /**
   * Deactivates a product manufacturer by ID.
   *
   * @param {string} id - The ID of the manufacturer to deactivate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(201)
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.manufacturerService.deactivate(id);
    return {
      status: true,
      message: 'manufacturer deactivated',
    };
  }

  /**
   * Deletes a product manufacturer by ID.
   *
   * @param {string} id - The ID of the manufacturer to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.manufacturerService.remove(id);
    return {
      status: true,
      message: 'manufacturer deleted',
    };
  }
}
