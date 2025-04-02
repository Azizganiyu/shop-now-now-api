import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/modules/product/entities/product.entity';
import { Wish } from './wish.entity';

@Entity()
export class WishItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  wishId: string;

  @ManyToOne(() => Wish, (wish) => wish.items)
  wish?: Wish;

  @Column()
  @ApiProperty()
  productId: string;

  @ManyToOne(() => Product, (product) => product.wishItems, { eager: true })
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
