import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsObject,
  ValidateNested,
} from 'class-validator';

export class AddressDetails {
  @ApiProperty({ example: '180 Freedom Way, Lagos, Nigeria' })
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 6.4519949 })
  @IsDefined()
  @IsNotEmpty()
  lat: number;

  @ApiProperty({ example: 3.4823186 })
  @IsNotEmpty()
  @IsDefined()
  lng: number;
}
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

  @ApiProperty({ type: AddressDetails })
  @IsDefined()
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => AddressDetails)
  address: AddressDetails;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  lgaId: string;
}

export class UpdateAddress extends CreateAddress {}
