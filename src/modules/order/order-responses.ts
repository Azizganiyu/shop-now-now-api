import { ApiProperty } from '@nestjs/swagger';
import {
  ApiResponseDto,
  MetaResponseDto,
  UserResponseDto,
} from '../misc/responses/api-response.dto';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { OrderShipment } from './entities/order-shipment.entity';

class OrderDataResponse extends Order {
  @ApiProperty({ type: OrderItem, isArray: true })
  items: OrderItem[];
}

export class OrderResponse extends ApiResponseDto {
  @ApiProperty({ type: OrderDataResponse })
  data: OrderDataResponse;
}

class OrderResponseFind {
  @ApiProperty({ type: OrderDataResponse, isArray: true })
  data: OrderDataResponse[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class OrderResponseAll extends ApiResponseDto {
  @ApiProperty({ type: OrderResponseFind })
  data: OrderResponseFind;
}

class ShipmentDataResponse extends OrderShipment {
  @ApiProperty({ type: OrderDataResponse })
  order: OrderDataResponse;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;
}

class ShipmentResponseFind {
  @ApiProperty({ type: ShipmentDataResponse, isArray: true })
  data: ShipmentDataResponse[];

  @ApiProperty()
  meta: MetaResponseDto;
}

export class ShipmentResponseAll extends ApiResponseDto {
  @ApiProperty({ type: ShipmentResponseFind })
  data: ShipmentResponseFind;
}
