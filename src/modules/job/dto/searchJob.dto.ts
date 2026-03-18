import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { jobType, Location } from 'src/common/Enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class SearchDto {
  @ApiPropertyOptional({ enum: Location })
  @IsEnum(Location)
  @IsOptional()
  location?: Location;

  @ApiPropertyOptional({ enum: jobType })
  @IsEnum(jobType)
  @IsOptional()
  type?: jobType;

  @ApiPropertyOptional({ type: [Number] })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  @IsOptional()
  skills?: number[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
