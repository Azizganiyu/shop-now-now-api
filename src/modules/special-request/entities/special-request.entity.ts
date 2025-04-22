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
export class SpecialRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  name: string;

  @Column()
  @ApiProperty()
  brand: string;

  @Column({ type: 'text', nullable: true })
  @ApiProperty()
  description?: string;

  @Column()
  @ApiProperty()
  quantity: number;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  read?: boolean;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.requests)
  user?: User;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
