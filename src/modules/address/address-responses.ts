import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { Address } from './entities/address.entity';

export class AddressDataResponse extends Address {}

export class AddressResponse extends ApiResponseDto {
  @ApiProperty({ type: AddressDataResponse })
  data: AddressDataResponse;
}

export class AddressResponseAll extends ApiResponseDto {
  @ApiProperty({ type: AddressDataResponse, isArray: true })
  data: AddressDataResponse[];
}
