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
import { LGA } from 'src/modules/location/entities/lga.entity';

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

  @Column({ nullable: true })
  @ApiProperty()
  lgaId?: string;

  @ManyToOne(() => LGA, (lga) => lga.addresses, {
    eager: true,
  })
  lga?: LGA;

  @Column({ type: 'json', nullable: true }) // Change to JSON type
  @ApiProperty({
    example: {
      description: '180 Freedom Way, Lagos, Nigeria',
      lat: 6.4519949,
      lng: 3.4823186,
    },
    type: 'object',
  })
  address: { description: string; lat: number; lng: number };

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
