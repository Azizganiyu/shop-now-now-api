import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatus {
  pending = 'pending',
  completed = 'completed',
  canceled = 'canceled',
}

export enum ShipmentStatus {
  pending = 'pending',
  processing = 'processing',
  in_transit = 'in-transit',
  delivered = 'delivered',
  canceled = 'canceled',
}

export enum OrderTypes {
  onetime = 'onetime',
  recurring = 'running',
}

export class ChangeOrderStatusDto {
  @ApiProperty({
    enum: ShipmentStatus,
  })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(ShipmentStatus)
  status: ShipmentStatus;
}
