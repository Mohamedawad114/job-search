import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './createCompany.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @IsString()
  @IsOptional()
  formatAddress: string;
  @IsNumber()
  @IsOptional()
  latitude: number;
  @IsNumber()
  @IsOptional()
  longitude: number;
}
