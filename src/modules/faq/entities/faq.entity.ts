import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Faq {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({ type: 'text' })
  @ApiProperty()
  question: string;

  @Column({ type: 'text' })
  @ApiProperty()
  answer: string;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;
}
