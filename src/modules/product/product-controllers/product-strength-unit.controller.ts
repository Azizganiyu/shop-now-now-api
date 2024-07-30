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
import { ProductStrengthUnitService } from '../product-services/strength-unit.service';
import {
  ProductStrengthUnitResponse,
  ProductStrengthUnitResponseAll,
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
  CreateProductStrengthUnit,
  UpdateProductStrengthUnit,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Strength Unit')
@Controller('product/strength-unit')
export class ProductStrengthUnitController {
  constructor(
    private readonly strengthUnitService: ProductStrengthUnitService,
  ) {}

  /**
   * Retrieves all product strength units.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the strength units.
   */
  @ApiOkResponse({ type: ProductStrengthUnitResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.strengthUnitService.findAll();
    return {
      status: true,
      message: 'strength units retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product strength unit by ID.
   *
   * @param {string} id - The ID of the strength unit to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the strength unit.
   */
  @ApiOkResponse({ type: ProductStrengthUnitResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Strength Unit ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.strengthUnitService.findOne(id);
    return {
      status: true,
      message: 'strength unit retrieved',
      data,
    };
  }

  /**
   * Creates a new product strength unit.
   *
   * @param {CreateProductStrengthUnit} request - The request body containing the details of the new strength unit.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created strength unit.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductStrengthUnitResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductStrengthUnit,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.strengthUnitService.create(request);
    return {
      status: true,
      message: 'strength unit created',
      data,
    };
  }

  /**
   * Updates an existing product strength unit by ID.
   *
   * @param {string} id - The ID of the strength unit to update.
   * @param {UpdateProductStrengthUnit} request - The request body containing the updated details of the strength unit.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated strength unit.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductStrengthUnitResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Strength Unit ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductStrengthUnit,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.strengthUnitService.update(id, request);
    return {
      status: true,
      message: 'strength unit updated',
      data,
    };
  }

  /**
   * Activates a product strength unit by ID.
   *
   * @param {string} id - The ID of the strength unit to activate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Strength Unit ID' })
  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.strengthUnitService.activate(id);
    return {
      status: true,
      message: 'strength unit activated',
    };
  }

  /**
   * Deactivates a product strength unit by ID.
   *
   * @param {string} id - The ID of the strength unit to deactivate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Strength Unit ID' })
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.strengthUnitService.deactivate(id);
    return {
      status: true,
      message: 'strength unit deactivated',
    };
  }

  /**
   * Deletes a product strength unit by ID.
   *
   * @param {string} id - The ID of the strength unit to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Strength Unit ID' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.strengthUnitService.remove(id);
    return {
      status: true,
      message: 'strength unit deleted',
    };
  }
}
