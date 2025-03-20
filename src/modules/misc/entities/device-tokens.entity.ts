import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class DeviceToken {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({ nullable: true })
  @ApiProperty()
  userId?: string;

  @ManyToOne(() => User, (user) => user.deviceTokens)
  user?: User;

  @Column()
  @ApiProperty()
  token: string;

  @Column()
  @ApiProperty()
  deviceId: string;

  @CreateDateColumn()
  @ApiProperty()
  updatedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;
}
