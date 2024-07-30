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
import { ProductSubCategory } from './product-sub-category.entity';
import { ProductPackUnit } from './product-pack-unit.entity';
import { ProductPresentation } from './product-presentation.entity';
import { ProductStrengthUnit } from './product-strength-unit.entity';
import { ProductManufacturer } from './product-manufacturer.entity';
import { Exclude } from 'class-transformer';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { OrderItem } from 'src/modules/order/entities/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @ApiProperty()
  name: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  ingredient?: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  description?: string;

  @Column({ nullable: true })
  @ApiProperty()
  packSize?: number;

  @Column({ nullable: true })
  @ApiProperty()
  strength?: number;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  costPrice?: number;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  sellingPrice?: number;

  @Column({ default: 1, nullable: true })
  @ApiProperty()
  stock?: number;

  @Column({ nullable: true })
  @ApiProperty()
  categoryId?: string;

  @ManyToOne(() => ProductCategory, (category) => category.products)
  category?: ProductCategory;

  @Column({ nullable: true })
  @ApiProperty()
  packUnitId?: string;

  @ManyToOne(() => ProductPackUnit, (packUnit) => packUnit.products)
  packUnit?: ProductPackUnit;

  @Column({ nullable: true })
  @ApiProperty()
  presentationId?: string;

  @Column({ nullable: true })
  @ApiProperty()
  image?: string;

  @ManyToOne(() => ProductPresentation, (presentation) => presentation.products)
  presentation?: ProductPresentation;

  @Column({ nullable: true })
  @ApiProperty()
  strengthUnitId?: string;

  @ManyToOne(() => ProductStrengthUnit, (strengthUnit) => strengthUnit.products)
  strengthUnit?: ProductStrengthUnit;

  @Column({ nullable: true })
  @ApiProperty()
  manufacturerId?: string;

  @ManyToOne(() => ProductManufacturer, (manufacturer) => manufacturer.products)
  manufacturer?: ProductManufacturer;

  @Column({ nullable: true })
  @ApiProperty()
  subCategoryId?: string;

  @ManyToOne(() => ProductSubCategory, (subCategory) => subCategory.products)
  subCategory?: ProductSubCategory;

  @OneToMany(() => Cart, (cart) => cart.product)
  @Exclude()
  carts?: Cart[];

  @OneToMany(() => OrderItem, (item) => item.product)
  @Exclude()
  orderItems?: OrderItem[];

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
