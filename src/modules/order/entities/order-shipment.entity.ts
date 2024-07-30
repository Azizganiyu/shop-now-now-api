import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { ShipmentStatus } from '../dto/order.dto';
import { Address } from 'src/modules/address/entities/address.entity';

@Entity()
export class OrderShipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  addressId: string;

  @ManyToOne(() => Address, (adress) => adress.shipments, { eager: true })
  address?: Address;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  amountPaid?: number;

  @Column()
  @ApiProperty()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.shipments)
  order?: Order;

  @Column()
  @ApiProperty()
  orderRef: string;

  @Column({ nullable: true })
  @ApiProperty()
  paymentRef?: string;

  @Column({ nullable: true, default: ShipmentStatus.pending })
  @ApiProperty()
  status?: string;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  paid?: boolean;

  @Column()
  @ApiProperty()
  duration: number;

  @Column()
  @ApiProperty()
  expectedDeliveryDate: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
