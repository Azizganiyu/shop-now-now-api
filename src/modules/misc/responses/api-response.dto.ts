import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  statusCode?: number;

  @ApiProperty()
  message: string;
}

export class MetaResponseDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  take: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  pageCount: number;

  @ApiProperty()
  hasPreviousPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;
}

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  avatar: string;

  @ApiProperty()
  emailVerifiedAt: Date;

  @ApiProperty()
  twoFactorAuthentication: boolean;

  @ApiProperty()
  roleId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
