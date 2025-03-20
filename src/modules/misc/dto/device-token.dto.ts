import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class SaveTokenDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  token: string;
}

export class UpdateTokenDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  deviceId: string;

  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  userId: string;
}
