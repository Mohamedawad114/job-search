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

export class CreateCompanyDto {
  @Length(4, 15)
  @IsString()
  @IsNotEmpty()
  name: string;
  @Length(4, 50)
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsUrl()
  @IsOptional()
  website: string;
  @Length(4, 150)
  @IsString()
  @IsOptional()
  address: string;
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  workTypeId: number;
}
