import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { degree } from 'src/common';

export class AddEducationDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 24)
  university: string;
  @IsString()
  @IsNotEmpty()
  @Length(3, 24)
  college: string;
  @IsEnum(degree)
  degree: degree;
  @IsDate()
  @Type(() => Date)
  @IsNotEmpty()
  startDate: Date;
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  graduationYear: number;
}
