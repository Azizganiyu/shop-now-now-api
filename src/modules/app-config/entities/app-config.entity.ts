import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AppConfig {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id?: string;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  weatherStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  weatherTitle?: string;

  @Column({ nullable: true })
  @ApiProperty()
  weatherBody?: string;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  pointStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  pointThreshold?: number;

  @Column({ nullable: true })
  @ApiProperty()
  pointAmount?: number;

  @Column({ nullable: true })
  @ApiProperty()
  pointValue?: number;

  @Column({ nullable: true, default: false })
  @ApiProperty()
  discountStatus?: boolean;

  @Column({ nullable: true })
  @ApiProperty()
  discountThreshold?: number;

  @Column({ nullable: true })
  @ApiProperty()
  discountValue?: number;

  @Column({ nullable: true })
  @ApiProperty()
  discountValueType?: string;
}
