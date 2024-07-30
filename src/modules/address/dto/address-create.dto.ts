import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateAddress {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  country: string;
}

export class UpdateAddress extends CreateAddress {}
