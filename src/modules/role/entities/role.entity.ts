import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { User } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Role {
  @PrimaryColumn()
  @ApiProperty()
  id: string;

  @ApiProperty()
  @Column({ length: 199 })
  name: string;

  @ApiProperty()
  @Column({ length: 199 })
  tag: string;

  @ApiProperty()
  @Column({ type: 'json', nullable: true })
  permissions?: string[];

  @OneToMany(() => User, (user) => user.role)
  users?: User[];

  @ApiProperty()
  @Column({ default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn()
  @Exclude()
  @ApiProperty()
  updatedAt?: Date;
}
