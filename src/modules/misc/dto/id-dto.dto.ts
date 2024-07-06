import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class IdDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  id: string;
}

export class InviteTokenDto {
  @IsDefined()
  @IsNotEmpty()
  @ApiProperty()
  invite_token: string;
}
