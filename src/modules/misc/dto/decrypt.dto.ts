import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty } from 'class-validator';

export class DecryptDto {
  @ApiProperty()
  @IsDefined()
  @IsNotEmpty()
  encrypted_text: string;
}
