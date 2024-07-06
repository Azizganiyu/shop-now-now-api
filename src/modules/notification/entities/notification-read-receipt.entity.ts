import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Notification } from './notification.entity';

@Entity()
export class NotificationReadReceipt {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ nullable: true })
  notificationId?: string;

  @ManyToOne(
    () => Notification,
    (notification) => notification.notificationReadReceipts,
  )
  notification?: Notification;

  @ApiProperty()
  @Column({ nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.notificationReadReceipts)
  user?: User;

  @CreateDateColumn()
  @ApiProperty()
  readAt?: Date;
}
