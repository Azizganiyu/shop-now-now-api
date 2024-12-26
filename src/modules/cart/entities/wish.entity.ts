import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/modules/user/entities/user.entity';
import { WishItem } from './wish-item.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @ApiProperty()
  reference: string;

  @Column()
  @ApiProperty()
  userId: string;

  @ManyToOne(() => User, (user) => user.carts)
  user?: User;

  @OneToMany(() => WishItem, (item) => item.wish, { eager: true })
  items?: WishItem[];

  @CreateDateColumn()
  @ApiProperty()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt?: Date;
}
