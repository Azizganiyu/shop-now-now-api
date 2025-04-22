import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AppConfig {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  weatherStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  weatherTitle?: string;

  @Column({ nullable: true })
  @ApiProperty()
  weatherBody?: string;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  pointStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  pointThreshold?: number;

  @Column({ nullable: true })
  @ApiProperty()
  pointAmount?: number;

  @Column({ nullable: true })
  @ApiProperty()
  pointValue?: number;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  discountStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  discountThreshold?: number;

  @Column({ nullable: true })
  @ApiProperty()
  discountValue?: number;

  @Column({ nullable: true })
  @ApiProperty()
  discountValueType?: string;

  @Column({ type: 'double', nullable: true, default: 8000 })
  @ApiProperty()
  defaultDeliveryPrice?: number;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  adminEmails?: string[];

  @Column({ type: 'json', nullable: true }) // Change to JSON type
  @ApiProperty({
    example: {
      description: '180 Freedom Way, Lagos, Nigeria',
      lat: 6.4519949,
      lng: 3.4823186,
    },
    type: 'object',
  })
  pickupAddress?: { description: string; lat: number; lng: number };

  @Column({ nullable: true })
  @ApiProperty()
  pickupName?: string;

  @Column({ nullable: true })
  @ApiProperty()
  pickupEmail?: string;

  @Column({ nullable: true })
  @ApiProperty()
  pickupPhone?: string;

  @Column({ nullable: true })
  @ApiProperty()
  paymentProvider?: string;
}
