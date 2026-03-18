import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { IApplication } from 'src/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class createApplication implements Partial<IApplication> {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(3, 50)
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(12)
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  expectedSalary: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  CV: string;

  @ApiProperty()
  @IsNumber()
  @IsPositive()
  noticePeriod: number;
}
