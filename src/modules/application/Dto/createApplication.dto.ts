import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { IApplication } from 'src/common';

export class createApplication implements Partial< IApplication> {
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  city: string;
  @IsString()
  @IsNotEmpty()
  @Length(12)
  phone: string;
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  expectedSalary: number;
  @IsString()
  @IsOptional()
  CV: string;
  @IsNumber()
  @IsPositive()
  noticePeriod: number;
}
