import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator';
import { OrderTypes } from 'src/modules/order/dto/order.dto';

export enum DurationType {
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
}

export class CartCheckout {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  addressId: string;

  @ApiProperty({ enum: OrderTypes, default: OrderTypes.onetime })
  @IsDefined()
  @IsNotEmpty()
  @IsEnum(OrderTypes)
  orderType: OrderTypes = OrderTypes.onetime;

  @ApiProperty({
    enum: DurationType,
    default: DurationType.DAY,
  })
  @IsDefined()
  @IsNotEmpty()
  @ValidateIf((o) => o.duration)
  @IsEnum(DurationType)
  durationType?: DurationType;

  @ApiProperty()
  @ValidateIf((o) => o.durationType)
  @IsDefined()
  @IsNotEmpty()
  duration?: number;

  @ApiPropertyOptional()
  @IsOptional()
  orderRef?: string;
}
