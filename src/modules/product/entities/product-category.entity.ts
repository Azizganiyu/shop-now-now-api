import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Product } from './product.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ProductBand } from './product-band.entity';

@Entity()
export class ProductCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, default: 1 })
  order: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  iconUrl?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @OneToMany(() => Product, (product) => product.category)
  products?: Product[];

  @Column({ nullable: true })
  @ApiProperty()
  bandId?: string;

  @ManyToOne(() => ProductBand, (band) => band.categories, {
    eager: true,
  })
  band?: ProductBand;

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
