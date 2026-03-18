import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty()
  @Length(4, 15)
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @Length(4, 50)
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsUrl()
  @IsOptional()
  website: string;

  @ApiPropertyOptional()
  @Length(4, 150)
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty()
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  workTypeId: number;
}
