import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindNotificationDto {
  @ApiPropertyOptional()
  @IsOptional()
  userId?: string;
}
