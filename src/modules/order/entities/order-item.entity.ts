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
import { Product } from 'src/modules/product/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  orderId: string;

  @ManyToOne(() => Order, (order) => order.items)
  order?: Order;

  @Column()
  @ApiProperty()
  productId: string;

  @ManyToOne(() => Product, (product) => product.orderItems, { eager: true })
  product?: Product;

  @Column()
  @ApiProperty({ nullable: true, default: 1 })
  quantity?: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
