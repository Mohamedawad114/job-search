import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';
import { updatePasswordDto } from './updatePassword.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto extends PartialType(updatePasswordDto) {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @Length(6)
  OTP: string;
}
