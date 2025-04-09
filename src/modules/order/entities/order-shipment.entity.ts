import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Order } from './order.entity';
import { ShipmentStatus } from '../dto/order.dto';
import { LGA } from 'src/modules/location/entities/lga.entity';
import { DeliveryItem } from 'src/modules/delivery/entities/delivery-item.entity';

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
  lgaId: string;

  @ManyToOne(() => LGA, (lga) => lga.shipments)
  lga?: LGA;

  @Column({ type: 'json', nullable: true }) // Change to JSON type
  @ApiProperty({
    example: {
      description: '180 Freedom Way, Lagos, Nigeria',
      lat: 6.4519949,
      lng: 3.4823186,
    },
    type: 'object',
  })
  address: { description: string; lat: number; lng: number };

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  houseAddress?: string;

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
  discount?: number;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  discountValue?: number;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    nullable: true,
    default: 0,
  })
  pointToCredit?: number;

  @Column({ nullable: true })
  @ApiProperty()
  discountType?: string;

  @Column({ nullable: true })
  @ApiProperty()
  discountValueType?: string;

  @Column({ nullable: true })
  @ApiProperty()
  couponCode?: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  additionalInfo?: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  fees?: Record<string, number>;

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

  @OneToMany(() => DeliveryItem, (delivery) => delivery.shipment)
  deliveries?: DeliveryItem[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
