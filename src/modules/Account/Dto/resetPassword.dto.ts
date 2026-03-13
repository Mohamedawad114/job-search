import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { updatePasswordDto } from './updatePassword.dto';
import { PartialType } from '@nestjs/mapped-types';
export class ResetPasswordDto extends PartialType(updatePasswordDto) {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @Length(6)
  OTP: string;
}
