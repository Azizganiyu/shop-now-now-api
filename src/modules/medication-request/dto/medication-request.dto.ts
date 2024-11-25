import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsPhoneNumber,
  IsInt,
  Min,
} from 'class-validator';

export class CreateMedicationRequestDto {
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsNotEmpty()
  @IsString()
  medication: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  quantity: number;
}
