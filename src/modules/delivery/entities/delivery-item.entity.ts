import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Delivery } from './delivery.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';

@Entity()
export class DeliveryItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  deliveryId: string;

  @ManyToOne(() => Delivery, (delivery) => delivery.items)
  delivery?: Delivery;

  @Column()
  @ApiProperty()
  shipmentId: string;

  @ManyToOne(() => OrderShipment, (shipment) => shipment.deliveries)
  shipment?: OrderShipment;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
