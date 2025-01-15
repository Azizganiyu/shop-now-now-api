import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { PaymentStatus } from 'src/modules/cart/dto/checkout.dto';

@Entity()
export class PaymentRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column({
    type: 'double',
    scale: 2,
    precision: 20,
    default: 0,
  })
  amount: number;

  @Column({ nullable: true })
  @ApiProperty()
  userId?: string;

  @ManyToOne(() => User, (user) => user.paymentRequests)
  user?: User;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  reference: string;

  @Column()
  @ApiProperty()
  code: string;

  @Column()
  @ApiProperty()
  url: string;

  @Column()
  @ApiProperty()
  entity: string;

  @Column()
  @ApiProperty()
  entityReference: string;

  @Column({ default: PaymentStatus.pending, nullable: true })
  @ApiProperty()
  status?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
