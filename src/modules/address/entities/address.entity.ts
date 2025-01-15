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
import { Location } from 'src/modules/location/entities/location.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({ length: 199 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 199 })
  lastName: string;

  @ApiProperty()
  @Column({ length: 199 })
  email: string;

  @ApiProperty()
  @Column({ length: 199 })
  phone: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses)
  user?: User;

  @Column()
  @ApiProperty()
  locationId: string;

  @ManyToOne(() => Location, (location) => location.addresses)
  location?: Location;

  @Column()
  @ApiProperty()
  address: string;

  @OneToMany(() => OrderShipment, (item) => item.address)
  @Exclude()
  shipments?: OrderShipment[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
