import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class MedicationRequest {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  fullName: string;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  phone: string;

  @Column()
  @ApiProperty()
  medication: string;

  @Column()
  @ApiProperty()
  quantity: number;

  @CreateDateColumn()
  @ApiProperty()
  updatedAt: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt: Date;
}
