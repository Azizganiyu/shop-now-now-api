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
import { User } from 'src/modules/user/entities/user.entity';
import { OrderStatus } from '../dto/order.dto';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';
import { PaymentType } from 'src/modules/cart/dto/checkout.dto';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  reference: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @Column({ nullable: true, default: PaymentType.CARD })
  @ApiProperty()
  paymentType?: string;

  @Column({ nullable: true, default: OrderStatus.pending })
  @ApiProperty()
  status?: string;

  @OneToMany(() => OrderItem, (item) => item.order, { eager: true })
  items?: OrderItem[];

  @OneToMany(() => OrderShipment, (item) => item.order)
  shipments?: OrderShipment[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
