import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  code: string;

  @ApiProperty()
  @Column({ type: 'double', scale: 2, precision: 20, nullable: true })
  value: number;

  @Column()
  @ApiProperty()
  valueType: string;

  @Column()
  @ApiProperty()
  startDate: Date;

  @Column({ nullable: true })
  @ApiProperty()
  startTime: string;

  @Column({ nullable: true })
  @ApiProperty()
  endTime: string;

  @Column()
  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
