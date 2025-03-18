import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryItem } from './delivery-item.entity';
import { DeliveryStatus } from '../dto/delivery.dto';

@Entity()
export class Delivery {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  reference: string;

  @Column({ nullable: true, default: DeliveryStatus.pending })
  @ApiProperty()
  status?: string;

  @OneToMany(() => DeliveryItem, (item) => item.delivery, { eager: true })
  items?: DeliveryItem[];

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  providerOrderId?: string; // Third-party order ID // Order status

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  amountQuoted?: number; // Delivery fee quoted

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  amountPaid?: number; // Actual payment made

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  distanceKm?: number; // Distance covered

  @Column({ type: 'int', nullable: true })
  @ApiProperty({ required: false })
  estimatedMinutes?: number; // Estimated delivery time

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  pickupAddress?: string; // Pickup location address

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  pickupLatitude?: number; // Pickup latitude

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  pickupLongitude?: number; // Pickup longitude

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  pickupOtp?: string; // Pickup OTP for verification

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  dropoffAddress?: string; // Drop-off location address

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  dropoffLatitude?: number; // Drop-off latitude

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  dropoffLongitude?: number; // Drop-off longitude

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  dropoffOtp?: string; // Drop-off OTP for verification

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  trackingUrl?: string; // Tracking link

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  driverName?: string; // Driver name

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  driverPhone?: string; // Driver phone number

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  driverAvatar?: string; // Driver's profile picture

  @Column({ type: 'float', nullable: true })
  @ApiProperty({ required: false })
  driverRating?: number; // Driver's rating

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  driverEta?: string; // Estimated time of arrival

  @Column({ nullable: true })
  @ApiProperty({ required: false })
  driverMeta?: string; // Estimated time of arrival

  @Column({ type: 'json', nullable: true })
  waypoints: any;

  @Column({ type: 'json', nullable: true })
  payments: any;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
