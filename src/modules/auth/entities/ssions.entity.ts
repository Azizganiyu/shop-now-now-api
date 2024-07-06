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
export class Ssions {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Exclude()
  @ApiProperty()
  @Column({ type: 'text' })
  token: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  clientType: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  clientName: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  clientVersion: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  osName: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  osVersion: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  deviceType: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  deviceBrand: string;

  @ApiProperty()
  @Column()
  expiresAt: Date;

  @Exclude()
  @ApiProperty()
  @Column({ nullable: true })
  userId?: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.sessions)
  user?: User;

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
