import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { jobType, Location } from 'src/common/Enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { ArgsType, Field } from '@nestjs/graphql';

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
@ArgsType()
export class SearchArgs {
  @Field(() => Location, { nullable: true })
  @IsEnum(Location)
  @IsOptional()
  location?: Location;

  @Field(() => jobType, { nullable: true })
  @IsEnum(jobType)
  @IsOptional()
  type?: jobType;

  @Field(() => [Number], { nullable: true })
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
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
  @Field(() => String, { nullable: true })
  @IsOptional()
  cursor?: string;

  @Field(() => Number, { defaultValue: 10 })
  @Min(1)
  limit: number;
}
