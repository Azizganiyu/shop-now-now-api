import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Location } from './location.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';

@Entity()
export class LGA {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  cities: string;

  @OneToMany(() => Location, (location) => location.lga)
  locations?: Location[];

  @OneToMany(() => Address, (address) => address.lga)
  addresses?: Address[];

  @OneToMany(() => OrderShipment, (item) => item.lga)
  shipments?: OrderShipment[];

  @CreateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;
}
