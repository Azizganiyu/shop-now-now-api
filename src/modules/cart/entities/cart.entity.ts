import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Expose, Transform } from 'class-transformer';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  productId: string;

  @ManyToOne(() => Product, (product) => product.carts, { eager: true })
  product?: Product;

  @Column()
  @ApiProperty()
  userId: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.product?.sellingPrice)
  unitAmount: number;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.product?.sellingPrice * obj.quantity)
  totalAmount: number;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @ApiProperty()
  @Column({ default: 1, nullable: true })
  quantity?: number;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
