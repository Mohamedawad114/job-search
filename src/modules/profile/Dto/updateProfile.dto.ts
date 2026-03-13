import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Gender, IUser, maritalStatus, MilitarySituation } from 'src/common';
export class UpdateProfileDto implements Partial<IUser> {
  @IsString()
  @Length(6, 20)
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  @IsEmail()
  email: string;
  @IsString()
  @Length(10, 15)
  @IsOptional()
  phoneNumber: string;
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateBirth: Date;
  @IsEnum(maritalStatus)
  @IsOptional()
  maritalStatus: maritalStatus;
  @IsEnum(MilitarySituation)
  @IsOptional()
  MilitarySituation: MilitarySituation;
  @IsString()
  @Length(6, 50)
  @IsOptional()
  bio: string;
  @IsNumber()
  @IsPositive()
  @IsOptional()
  companyId: number;
}
