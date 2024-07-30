import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { OrderShipment } from 'src/modules/order/entities/order-shipment.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @Column()
  @ApiProperty()
  country: string;

  @Column()
  @ApiProperty()
  state: string;

  @Column()
  @ApiProperty()
  city: string;

  @Column()
  @ApiProperty()
  address: string;

  @OneToMany(() => OrderShipment, (item) => item.order)
  @Exclude()
  shipments?: OrderShipment[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
