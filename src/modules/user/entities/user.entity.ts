import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { Ssions } from 'src/modules/auth/entities/ssions.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { NotificationReadReceipt } from 'src/modules/notification/entities/notification-read-receipt.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { ProductReview } from 'src/modules/review/entities/review.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  firstName?: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  lastName?: string;

  @ApiProperty()
  @Column({ unique: true, length: 199, nullable: true })
  username?: string;

  @ApiProperty()
  @Column({ length: 199 })
  email: string;

  @ApiProperty()
  @Column({ length: 199, nullable: true })
  phone?: string;

  @ApiProperty()
  @Column({ length: 199 })
  @Exclude()
  password: string;

  @ApiProperty()
  @Column({ length: 255 })
  avatar?: string;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  tokenExpireAt?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  code?: string;

  @Column({ nullable: true, type: 'text' })
  @Exclude()
  twoFactorAuthenticationSecret?: string;

  @Column({ nullable: true, default: 0 })
  @Exclude()
  loginAttempt?: number;

  @Column({ nullable: true })
  @Exclude()
  loginRetryTime?: Date;

  @ApiProperty()
  @Column({ nullable: true })
  verifiedAt?: Date;

  @ApiProperty()
  @Column({ default: false })
  twoFactorAuthentication?: boolean;

  @ApiProperty()
  @Column({ nullable: true })
  @Exclude()
  reference?: string;

  @ApiProperty()
  @Column({ nullable: true, default: 3 })
  roleId: string;

  @ManyToOne(() => Role, (role) => role.users)
  role?: Role;

  @Transform(({ value }) =>
    value && value.length > 1
      ? value.sort((a, b) => b.updatedAt - a.updatedAt)[0]
      : {},
  )
  @OneToMany(() => Ssions, (session) => session.user)
  sessions?: Ssions[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities?: Activity[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @Exclude()
  notifications?: Notification[];

  @OneToMany(() => NotificationReadReceipt, (receipt) => receipt.user)
  @Exclude()
  notificationReadReceipts?: NotificationReadReceipt[];

  @OneToMany(() => Cart, (cart) => cart.user)
  @Exclude()
  carts?: Cart[];

  @OneToMany(() => ProductReview, (review) => review.user)
  @Exclude()
  reviews?: ProductReview[];

  @OneToMany(() => Address, (address) => address.user)
  @Exclude()
  addresses?: Address[];

  @ApiProperty()
  @Column({ default: 'active' })
  status?: string;

  @ApiProperty()
  @Exclude()
  @Column({ nullable: true, default: false })
  isDeleted?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
