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
import { ProductBandService } from '../product-services/band.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/modules/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import {
  CreateProductBand,
  UpdateProductBand,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Band')
@Controller('band')
export class ProductBandController {
  constructor(private readonly bandService: ProductBandService) {}

  /**
   * Retrieves all product bands.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the bands.
   */
  @ApiOkResponse()
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.bandService.findAll();
    return {
      status: true,
      message: 'bands retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product band by ID.
   *
   * @param {string} id - The ID of the band to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the band.
   */
  @ApiOkResponse()
  @HttpCode(200)
  @Get(':id')
  @ApiParam({ name: 'id', description: 'Band ID' })
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.bandService.findOne(id);
    return {
      status: true,
      message: 'band retrieved',
      data,
    };
  }

  /**
   * Creates a new product band.
   *
   * @param {CreateProductBand} request - The request body containing the details of the new band.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created band.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiCreatedResponse()
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductBand,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.bandService.create(request);
    return {
      status: true,
      message: 'band created',
      data,
    };
  }

  /**
   * Updates an existing product band by ID.
   *
   * @param {string} id - The ID of the band to update.
   * @param {UpdateProductBand} request - The request body containing the updated details of the band.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated band.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse()
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Band ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductBand,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.bandService.update(id, request);
    return {
      status: true,
      message: 'band updated',
      data,
    };
  }

  /**
   * Deletes a product band by ID.
   *
   * @param {string} id - The ID of the band to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Band ID' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.bandService.remove(id);
    return {
      status: true,
      message: 'band deleted',
    };
  }
}
