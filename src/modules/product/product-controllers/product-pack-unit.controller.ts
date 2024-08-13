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
import { ProductPackUnitService } from '../product-services/pack-unit.service';
import {
  ProductPackUnitResponse,
  ProductPackUnitResponseAll,
} from '../responses/product-descriptor-response';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import {
  CreateProductPackUnit,
  UpdateProductPackUnit,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user', 'admin')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Pack Unit')
@Controller('product/pack-unit')
export class ProductPackUnitController {
  constructor(private readonly packUnitService: ProductPackUnitService) {}

  /**
   * Retrieves all product pack units.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the pack units.
   */
  @ApiOkResponse({ type: ProductPackUnitResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.packUnitService.findAll();
    return {
      status: true,
      message: 'packUnits retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product pack unit by ID.
   *
   * @param {string} id - The ID of the pack unit to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the pack unit.
   */
  @ApiOkResponse({ type: ProductPackUnitResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Pack Unit ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.packUnitService.findOne(id);
    return {
      status: true,
      message: 'pack unit retrieved',
      data,
    };
  }

  /**
   * Creates a new product pack unit.
   *
   * @param {CreateProductPackUnit} request - The request body containing the details of the new pack unit.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created pack unit.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductPackUnitResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductPackUnit,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.packUnitService.create(request);
    return {
      status: true,
      message: 'pack unit created',
      data,
    };
  }

  /**
   * Updates an existing product pack unit by ID.
   *
   * @param {string} id - The ID of the pack unit to update.
   * @param {UpdateProductPackUnit} request - The request body containing the updated details of the pack unit.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated pack unit.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductPackUnitResponse })
  @ApiParam({ name: 'id', description: 'Pack Unit ID' })
  @HttpCode(200)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductPackUnit,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.packUnitService.update(id, request);
    return {
      status: true,
      message: 'pack unit updated',
      data,
    };
  }

  /**
   * Activates a product pack unit by ID.
   *
   * @param {string} id - The ID of the pack unit to activate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Pack Unit ID' })
  @HttpCode(200)
  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.packUnitService.activate(id);
    return {
      status: true,
      message: 'pack unit activated',
    };
  }

  /**
   * Deactivates a product pack unit by ID.
   *
   * @param {string} id - The ID of the pack unit to deactivate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Pack Unit ID' })
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.packUnitService.deactivate(id);
    return {
      status: true,
      message: 'pack unit deactivated',
    };
  }

  /**
   * Deletes a product pack unit by ID.
   *
   * @param {string} id - The ID of the pack unit to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Pack Unit ID' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.packUnitService.remove(id);
    return {
      status: true,
      message: 'pack unit deleted',
    };
  }
}
