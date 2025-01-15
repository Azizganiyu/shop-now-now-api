import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateAddress {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  locationId: string;
}

export class UpdateAddress extends CreateAddress {}
