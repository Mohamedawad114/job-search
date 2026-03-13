import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class ConfirmEmailDto {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsAlphanumeric()
  @Length(6)
  @IsNotEmpty()
  OTP: string;
}
