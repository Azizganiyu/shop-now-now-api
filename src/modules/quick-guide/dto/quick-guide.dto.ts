import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateQuickGuideDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;

  @IsNotEmpty()
  @IsString()
  // @IsUrl()
  imageUrl: string;
}
