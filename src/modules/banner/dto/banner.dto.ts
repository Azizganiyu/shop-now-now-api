import { IsDefined, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateBannerDto {
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  // @IsUrl()
  imageUrl: string;
}
