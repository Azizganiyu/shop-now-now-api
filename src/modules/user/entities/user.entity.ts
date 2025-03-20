import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform } from 'class-transformer';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { Address } from 'src/modules/address/entities/address.entity';
import { Ssions } from 'src/modules/auth/entities/ssions.entity';
import { Cart } from 'src/modules/cart/entities/cart.entity';
import { Wish } from 'src/modules/cart/entities/wish.entity';
import { DeviceToken } from 'src/modules/misc/entities/device-tokens.entity';
import { NotificationReadReceipt } from 'src/modules/notification/entities/notification-read-receipt.entity';
import { Notification } from 'src/modules/notification/entities/notification.entity';
import { PaymentRequest } from 'src/modules/payment/entities/payment-request.entity';
import { ProductReview } from 'src/modules/review/entities/review.entity';
import { Role } from 'src/modules/role/entities/role.entity';
import { SpecialRequest } from 'src/modules/special-request/entities/special-request.entity';
import { Transaction } from 'src/modules/transaction/entities/transaction.entity';
import { Wallet } from 'src/modules/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
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
  @Column({ length: 199 })
  firstName: string;

  @ApiProperty()
  @Column({ length: 199 })
  lastName: string;

  @ApiProperty()
  @Column({ unique: true, length: 199 })
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
  emailVerifiedAt?: Date;

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

  @OneToMany(() => DeviceToken, (token) => token.user)
  deviceTokens?: DeviceToken[];

  @OneToMany(() => Notification, (notification) => notification.user)
  @Exclude()
  notifications?: Notification[];

  @OneToMany(() => NotificationReadReceipt, (receipt) => receipt.user)
  @Exclude()
  notificationReadReceipts?: NotificationReadReceipt[];

  @OneToMany(() => Cart, (cart) => cart.user)
  @Exclude()
  carts?: Cart[];

  @OneToMany(() => PaymentRequest, (payment) => payment.user)
  paymentRequests?: PaymentRequest[];

  @OneToMany(() => SpecialRequest, (request) => request.user)
  @Exclude()
  requests?: SpecialRequest[];

  @OneToMany(() => Wish, (wish) => wish.user)
  @Exclude()
  wishes?: Wish[];

  @OneToMany(() => ProductReview, (review) => review.user)
  @Exclude()
  reviews?: ProductReview[];

  @OneToMany(() => Address, (address) => address.user)
  @Exclude()
  addresses?: Address[];

  @ApiProperty()
  @Column({ default: 'active' })
  status?: string;

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  @Exclude()
  transactions?: Transaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.user)
  @Exclude()
  wallets?: Wallet[];

  @ApiProperty()
  @Column({ default: false })
  changedPassword?: boolean;

  @DeleteDateColumn()
  @Exclude()
  deletedAt?: Date;

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
