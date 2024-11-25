import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
} from '../misc/responses/api-response.dto';
import { MedicationRequest } from './entity/medication-request.entity';

export class MedicationRequestDataResponse extends MedicationRequest {}

export class MedicationRequestResponse extends ApiResponseDto {
  @ApiProperty({ type: MedicationRequestDataResponse })
  data: MedicationRequestDataResponse;
}

class MedicationRequestFind {
  @ApiProperty({ type: MedicationRequestDataResponse, isArray: true })
  data: MedicationRequestDataResponse[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class MedicationRequestResponseAll extends ApiResponseDto {
  @ApiProperty({ type: MedicationRequestFind })
  data: MedicationRequestFind;
}
