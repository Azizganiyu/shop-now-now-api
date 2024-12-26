import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ length: 199 })
  type: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  purpose: string;

  @ApiProperty()
  @Column({ length: 199 })
  currency: string;

  @ApiProperty()
  @Column({ length: 199 })
  reference: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true, unique: true })
  providerReference?: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  amount: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  amountSettled?: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  amountCharged?: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  fee?: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  providerFee?: number;

  @ApiProperty()
  @Transform(({ value }) =>
    value && value.length > 1 ? JSON.parse(value) : value,
  )
  @Column({ nullable: true })
  beneficiary?: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  userId?: string;

  @ManyToOne(() => User, (user) => user.transactions)
  user?: User;

  @ApiProperty()
  @Column({ nullable: true })
  paymentProvider?: string;

  @ApiProperty()
  @Column({ default: 'pending' })
  status?: string;

  @ApiProperty()
  @Column({ default: 'pending' })
  _status?: string;

  @Exclude()
  @ApiProperty()
  @Column({ length: 199, nullable: true })
  message?: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision' })
  balanceBefore?: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision' })
  balanceAfter?: number;

  @Column({ nullable: true })
  @ApiProperty()
  settledAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
