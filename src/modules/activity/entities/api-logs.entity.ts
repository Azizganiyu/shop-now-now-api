import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ApiLog {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column()
  @ApiProperty()
  type: string;

  @Column({ nullable: true })
  @ApiProperty()
  path?: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  payload?: string;

  @Column({ nullable: true, type: 'text' })
  @ApiProperty()
  message?: string;

  @Column({ nullable: true, type: 'longtext' })
  @ApiProperty()
  response?: string;

  @Column({ nullable: true })
  @ApiProperty()
  ipAddress?: string;

  @Column({ nullable: true })
  @ApiProperty()
  accessType?: string;

  @Column({ nullable: true })
  @ApiProperty()
  accessId?: string;

  @Column({ nullable: true })
  @ApiProperty()
  email?: string;

  @Column({ nullable: true, default: true })
  @ApiProperty()
  status?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  otherInfo?: string;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
