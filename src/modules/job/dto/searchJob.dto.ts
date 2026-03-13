import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { jobType, Location } from 'src/common';

export class SearchDto {
  @IsEnum(Location)
  @IsOptional()
  location?: Location;
  @IsEnum(jobType)
  @IsOptional()
  type?: jobType;
  @IsArray({ each: true })
  @IsNumber()
  @IsPositive({ each: true })
  @IsOptional()
  skills?: string[];
  @IsString()
  @IsOptional()
  search?: string;
}
