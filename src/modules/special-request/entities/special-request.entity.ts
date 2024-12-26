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

  @Column({ type: 'text' })
  @ApiProperty()
  request: string;

  @Column({ type: 'text' })
  @ApiProperty()
  comment: string;

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
