import { ApiProperty } from '@nestjs/swagger';
import { ProductBand } from 'src/modules/product/entities/product-band.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { LGA } from './lga.entity';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({ default: true })
  @ApiProperty()
  canDeliver?: boolean;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  deliveryPrice: number;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  bandId?: string;

  @ManyToOne(() => ProductBand, (band) => band.locations, {
    eager: true,
  })
  band?: ProductBand;

  @Column({ nullable: true })
  @ApiProperty()
  lgaId?: string;

  @ManyToOne(() => LGA, (lga) => lga.locations, {
    eager: true,
  })
  lga?: LGA;

  @OneToMany(() => Schedule, (schedule) => schedule.location)
  schedules?: Schedule[];

  @CreateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;
}
