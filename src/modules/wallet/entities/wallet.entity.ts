import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
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
export class Wallet {
  @Exclude()
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ length: 199 })
  currencyCode: string;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  balance: number;

  @ApiProperty()
  @Column({ nullable: true, type: 'double precision', default: 0 })
  points: number;

  @ApiProperty()
  @Column()
  @Exclude()
  userId: string;

  @ManyToOne(() => User, (user) => user.wallets)
  user?: User;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Exclude()
  updatedAt?: Date;
}
