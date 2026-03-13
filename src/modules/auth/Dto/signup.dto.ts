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
  ValidateIf,
} from 'class-validator';
import {
  Gender,
  IUser,
  maritalStatus,
  MilitarySituation,
  Sys_Role,
} from 'src/common';
import { Type } from 'class-transformer';
export class signupDto implements Partial<IUser> {
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @Length(8, 64)
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?.&-])[A-Za-z\d@$!%?.&-]{8,}$/,
    {
      message:
        'Password must be at least 8 characters long and include uppercase, lowercase, number and special character',
    },
  )
  password: string;
  @IsString()
  @Length(10, 15)
  @IsNotEmpty()
  phoneNumber: string;
  @IsEnum(Sys_Role)
  role?: Sys_Role;
  @IsEnum(Gender)
  gender: Gender;
  @IsDate()
  @Type(() => Date)
  dateBirth: Date;
  @IsEnum(maritalStatus)
  @IsNotEmpty()
  maritalStatus: maritalStatus;
  @ValidateIf((o) => o.gender === Gender.male)
  @IsEnum(MilitarySituation)
  @IsNotEmpty()
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
