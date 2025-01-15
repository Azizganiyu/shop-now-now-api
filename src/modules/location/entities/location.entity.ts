import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'src/modules/address/entities/address.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';
import { Schedule } from 'src/modules/schedule/entities/schedule.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column({ default: true })
  @ApiProperty()
  canDeliver?: boolean;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  deliveryPrice: number;

  @OneToMany(() => OrderShipment, (item) => item.location)
  shipments?: OrderShipment[];

  @OneToMany(() => Address, (item) => item.location)
  addresses?: Address[];

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @OneToMany(() => Schedule, (schedule) => schedule.location)
  schedules?: Schedule[];

  @CreateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;
}
