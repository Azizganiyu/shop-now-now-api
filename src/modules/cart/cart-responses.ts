import { ApiProperty } from '@nestjs/swagger';
import { ApiResponseDto } from '../misc/responses/api-response.dto';
import { Cart } from './entities/cart.entity';

class CartDataResponse extends Cart {}

export class CartResponse extends ApiResponseDto {
  @ApiProperty({ type: CartDataResponse })
  data: CartDataResponse;
}

export class CartResponseAll extends ApiResponseDto {
  @ApiProperty({ type: CartDataResponse, isArray: true })
  data: CartDataResponse[];
}
