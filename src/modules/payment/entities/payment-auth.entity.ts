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

@Entity()
export class PaymentAuth {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @Column({ type: 'text' })
  @ApiProperty()
  auth: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  provider: string;

  @Column({ type: 'text' })
  @ApiProperty()
  description: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
