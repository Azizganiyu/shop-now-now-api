import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { NotificationReadReceipt } from './notification-read-receipt.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'longtext' })
  message: string;

  @ApiProperty()
  @Exclude()
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.notifications, {
    onDelete: 'CASCADE',
  })
  user?: User;

  @ApiProperty()
  @Exclude()
  @Column({ default: false })
  userShared?: boolean;

  @ApiProperty()
  @Exclude()
  @Column({ nullable: true, default: '[]' })
  channels?: string;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  @Exclude()
  emailSent?: boolean;

  @ApiProperty()
  @Column({ nullable: true, default: false })
  @Exclude()
  localSent?: boolean;

  @OneToMany(() => NotificationReadReceipt, (receipt) => receipt.user)
  @Exclude()
  notificationReadReceipts?: NotificationReadReceipt[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @Exclude()
  @ApiProperty()
  updatedAt?: Date;
}
