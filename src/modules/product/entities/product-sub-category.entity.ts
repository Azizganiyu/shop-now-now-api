import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ProductCategory } from './product-category.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity()
export class ProductSubCategory {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  description?: string;

  @Column({ nullable: true })
  @ApiProperty()
  categoryId: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category?: ProductCategory;

  @OneToMany(() => Product, (product) => product.subCategory)
  products?: Product[];

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
