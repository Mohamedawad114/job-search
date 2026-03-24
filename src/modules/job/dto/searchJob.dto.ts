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
import { Transform } from 'class-transformer';

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
  @IsOptional()
  @IsArray()
  @Transform(({ value }) => {
    if (Array.isArray(value)) {
      return value.map((item) => Number(item));
    }
    return [Number(value)];
  })
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  skills?: number[];
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  search?: string;
}
