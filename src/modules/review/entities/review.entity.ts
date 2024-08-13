// src/product-review/product-review.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/product/entities/product.entity';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ApiProperty()
  rating: number;

  @Column()
  @ApiProperty()
  comment: string;

  @Column()
  @ApiProperty()
  productId: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  product?: Product;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.reviews)
  user: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
