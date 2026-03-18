import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './createCompany.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  formatAddress: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  latitude: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  longitude: number;
}
