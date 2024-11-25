import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MedicationRequestService } from './medication-request.service';
import { CreateMedicationRequestDto } from './dto/medication-request.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  MedicationRequestResponse,
  MedicationRequestResponseAll,
} from './medication-request-response';
import { PageOptionsDto } from 'src/utilities/pagination/dtos';
import { FindMedicationRequestDto } from './dto/find-medication-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorator/roles.decorator';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Medication Request')
@Controller('medication-requests')
export class MedicationRequestController {
  constructor(
    private readonly medicationRequestService: MedicationRequestService,
  ) {}

  @ApiCreatedResponse({ type: MedicationRequestResponse })
  @HttpCode(201)
  @Post()
  async create(
    @Body() createMedicationRequestDto: CreateMedicationRequestDto,
  ): Promise<MedicationRequestResponse> {
    const data = await this.medicationRequestService.createRequest(
      createMedicationRequestDto,
    );
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse({ type: MedicationRequestResponseAll })
  @HttpCode(200)
  @Get()
  async findAll(
    @Query() filter: FindMedicationRequestDto,
    @Query() pageOptionsdto: PageOptionsDto,
  ): Promise<MedicationRequestResponseAll> {
    const data = await this.medicationRequestService.findAll(
      filter,
      pageOptionsdto,
    );
    return {
      status: true,
      message: 'success',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOkResponse({ type: MedicationRequestResponse })
  @HttpCode(200)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MedicationRequestResponse> {
    const data = await this.medicationRequestService.findOne(id);
    return {
      status: true,
      message: 'success',
      data,
    };
  }
}
