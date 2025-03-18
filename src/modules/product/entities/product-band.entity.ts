import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ProductCategory } from './product-category.entity';
import { Location } from 'src/modules/location/entities/location.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';
import { BandFees } from '../dto/product-create.dto';

@Entity()
export class ProductBand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({
    description: 'Fees for a band',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        type: { type: 'string' },
        value: { type: 'number' },
      },
    },
  })
  fees?: BandFees[];

  @ApiProperty()
  @Column({
    type: 'double',
    default: 3500,
    nullable: true,
  })
  minimumOrderAmount: number;

  @OneToMany(() => ProductCategory, (category) => category.band)
  categories?: ProductCategory[];

  @OneToMany(() => Location, (location) => location.band)
  locations?: Location[];

  @OneToMany(() => Schedule, (schedule) => schedule.band)
  schedules?: Schedule[];

  @Column({ type: 'double', nullable: true })
  @ApiProperty()
  sellingPricePercentage?: number;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
