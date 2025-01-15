import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Location } from 'src/modules/location/entities/location.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @ApiProperty()
  @Column({ nullable: true })
  locationId: string;

  @ManyToOne(() => Location, (location) => location.schedules)
  location?: Location;

  @ApiProperty()
  @Column()
  day: string;

  @ApiProperty()
  @Column()
  start: string;

  @ApiProperty()
  @Column()
  end: string;

  @ApiProperty()
  @Column()
  interval: number;

  @ApiProperty()
  @Column({ nullable: true, default: true })
  status?: boolean;

  @CreateDateColumn()
  @ApiProperty()
  @Exclude()
  createdAt?: Date;

  @UpdateDateColumn()
  @ApiProperty()
  @Exclude()
  updatedAt?: Date;
}
