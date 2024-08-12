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
import { ProductPresentationService } from '../product-services/presentation.service';
import {
  ProductPresentationResponse,
  ProductPresentationResponseAll,
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
  CreateProductPresentation,
  UpdateProductPresentation,
} from '../dto/product-create.dto';
import { ApiResponseDto } from 'src/modules/misc/responses/api-response.dto';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('user')
@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Product Presentation')
@Controller('product/presentation')
export class ProductPresentationController {
  constructor(
    private readonly presentationService: ProductPresentationService,
  ) {}

  /**
   * Retrieves all product presentations.
   *
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the presentations.
   */
  @ApiOkResponse({ type: ProductPresentationResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.presentationService.findAll();
    return {
      status: true,
      message: 'presentations retrieved',
      data,
    };
  }

  /**
   * Retrieves a single product presentation by ID.
   *
   * @param {string} id - The ID of the presentation to retrieve.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the presentation.
   */
  @ApiOkResponse({ type: ProductPresentationResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Presentation ID' })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.presentationService.findOne(id);
    return {
      status: true,
      message: 'presentation retrieved',
      data,
    };
  }

  /**
   * Creates a new product presentation.
   *
   * @param {CreateProductPresentation} request - The request body containing the details of the new presentation.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the created presentation.
   */
  @Roles('admin')
  @ApiCreatedResponse({ type: ProductPresentationResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() request: CreateProductPresentation,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.presentationService.create(request);
    return {
      status: true,
      message: 'presentation created',
      data,
    };
  }

  /**
   * Updates an existing product presentation by ID.
   *
   * @param {string} id - The ID of the presentation to update.
   * @param {UpdateProductPresentation} request - The request body containing the updated details of the presentation.
   * @returns {Promise<{ status: boolean, message: string, data: any }>} The status, message, and data containing the updated presentation.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ProductPresentationResponse })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Presentation ID' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() request: UpdateProductPresentation,
  ): Promise<{ status: boolean; message: string; data: any }> {
    const data = await this.presentationService.update(id, request);
    return {
      status: true,
      message: 'presentation updated',
      data,
    };
  }

  /**
   * Activates a product presentation by ID.
   *
   * @param {string} id - The ID of the presentation to activate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Presentation ID' })
  @Patch(':id/activate')
  async activate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.presentationService.activate(id);
    return {
      status: true,
      message: 'presentation activated',
    };
  }

  /**
   * Deactivates a product presentation by ID.
   *
   * @param {string} id - The ID of the presentation to deactivate.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @ApiParam({ name: 'id', description: 'Presentation ID' })
  @HttpCode(200)
  @Patch(':id/deactivate')
  async deactivate(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.presentationService.deactivate(id);
    return {
      status: true,
      message: 'presentation deactivated',
    };
  }

  /**
   * Deletes a product presentation by ID.
   *
   * @param {string} id - The ID of the presentation to delete.
   * @returns {Promise<{ status: boolean, message: string }>} The status and message.
   */
  @Roles('admin')
  @ApiOkResponse({ type: ApiResponseDto })
  @HttpCode(200)
  @ApiParam({ name: 'id', description: 'Presentation ID' })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ status: boolean; message: string }> {
    await this.presentationService.remove(id);
    return {
      status: true,
      message: 'presentation deleted',
    };
  }
}
