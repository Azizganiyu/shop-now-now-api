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

@Entity()
export class OrderShipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 199 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 199 })
  lastName: string;

  @ApiProperty()
  @Column({ length: 199 })
  email: string;

  @ApiProperty()
  @Column({ length: 199 })
  phone: string;

  @Column()
  @ApiProperty()
  state: string;

  @Column()
  @ApiProperty()
  city: string;

  @Column()
  @ApiProperty()
  address: string;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  amount: number;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  deliveryFee: number;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  tax: number;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  amountToPay: number;

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
  reference: string;

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
  expectedDeliveryDate: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
