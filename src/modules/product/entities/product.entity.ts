import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';
import { ProductReview } from 'src/modules/review/entities/review.entity';
import { WishItem } from 'src/modules/cart/entities/wish-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  description?: string;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  costPrice?: number;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  sellingPrice?: number;

  @Column({ default: 1000000, nullable: true })
  @ApiProperty()
  stock?: number;

  @Column({ nullable: true })
  @ApiProperty()
  minOrder?: number;

  @Column({ nullable: true })
  @ApiProperty()
  maxOrder?: number;

  @Column({ nullable: true })
  @ApiProperty()
  categoryId?: string;

  @ManyToOne(() => ProductCategory, (category) => category.products, {
    eager: true,
  })
  category?: ProductCategory;

  @Column({ type: 'longtext', nullable: true })
  @ApiProperty()
  image?: string;

  @Column({ unique: true, nullable: true })
  @ApiProperty()
  sku?: string;

  @OneToMany(() => Cart, (cart) => cart.product)
  @Exclude()
  carts?: Cart[];

  @OneToMany(() => ProductReview, (review) => review.product)
  @Exclude()
  reviews?: ProductReview[];

  @OneToMany(() => OrderItem, (item) => item.product)
  @Exclude()
  orderItems?: OrderItem[];

  @OneToMany(() => WishItem, (item) => item.product)
  @Exclude()
  wishItems?: WishItem[];

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
