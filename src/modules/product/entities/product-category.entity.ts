import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductSubCategory } from './product-sub-category.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @OneToMany(() => ProductSubCategory, (subCategory) => subCategory.category)
  subCategories?: ProductSubCategory[];

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
