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
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column()
  event: string;

  @ApiProperty()
  @Column({ nullable: true })
  description?: string;

  @ApiProperty()
  @Column({ nullable: true })
  ipAddress?: string;

  @Exclude()
  @ApiProperty()
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.activities)
  user?: User;

  @ApiProperty()
  @Column({ type: 'text', nullable: true })
  object?: string;

  @ApiProperty()
  @Column({ nullable: true })
  objectId?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
