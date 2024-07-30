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
import { OrderStatus, OrderTypes } from '../dto/order.dto';
import { OrderItem } from './order-item.entity';
import { OrderShipment } from './order-shipment.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @Column({ nullable: true, default: OrderTypes.onetime })
  @ApiProperty()
  type?: string;

  @Column({ nullable: true, default: OrderStatus.pending })
  @ApiProperty()
  status?: string;

  @ApiProperty()
  @Column({ nullable: true })
  duration?: number;

  @ApiProperty()
  @Column({ nullable: true })
  durationType?: string;

  @Column({ nullable: true })
  @ApiProperty()
  nextShipmentDate?: Date;

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
