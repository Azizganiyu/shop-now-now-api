import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  ClassSerializerInterceptor,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CalculateBmiDto } from './dto/calculate-bmi.dto';
import { BmiService } from './services/body-mass-index.service';
import { CalculateBmiResponse } from './reponses/calculate-bmi.response';

@ApiBearerAuth('JWT-auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Health Calculator')
@Controller('medication-requests')
export class HealthCalculatorController {
  constructor(private readonly bmiService: BmiService) {}

  @ApiCreatedResponse({ type: CalculateBmiResponse })
  @HttpCode(200)
  @Post('bmi')
  async create(
    @Body() request: CalculateBmiDto,
  ): Promise<CalculateBmiResponse> {
    const data = await this.bmiService.calculateBmi(request);
    return {
      status: true,
      message: 'success',
      data,
    };
  }
}
