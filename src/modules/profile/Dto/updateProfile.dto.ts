import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { IUser } from 'src/common';
import { maritalStatus, MilitarySituation } from 'src/common/Enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProfileDto implements Partial<IUser> {
  @ApiPropertyOptional()
  @IsString()
  @Length(6, 20)
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsString()
  @Length(10, 15)
  @IsOptional()
  phoneNumber?: string;

  @ApiPropertyOptional({ type: Date, example: '1995-01-01' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  dateBirth?: Date;

  @ApiPropertyOptional({ enum: maritalStatus })
  @IsEnum(maritalStatus)
  @IsOptional()
  maritalStatus?: maritalStatus;

  @ApiPropertyOptional({ enum: MilitarySituation })
  @IsEnum(MilitarySituation)
  @IsOptional()
  MilitarySituation?: MilitarySituation;

  @ApiPropertyOptional()
  @IsString()
  @Length(6, 50)
  @IsOptional()
  bio?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  companyId?: number;
}
