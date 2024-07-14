import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class TempUser {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ length: 199 })
  email: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  tokenExpireAt?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  code?: string;

  @ApiProperty()
  @Column({ nullable: true })
  verifiedAt?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  verificationExpireAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
