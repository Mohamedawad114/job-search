import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { jobType, Location, skillsLevel } from 'src/common/Enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

class AddSkillDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  skillId: number;

  @ApiProperty({ enum: skillsLevel })
  @IsEnum(skillsLevel)
  level: skillsLevel;
}

export class CreateJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(4, 24)
  position: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  @Length(10, 500)
  description: string;

  @ApiProperty({ enum: jobType })
  @IsEnum(jobType)
  type: jobType;

  @ApiProperty({ enum: Location })
  @IsEnum(Location)
  location: Location;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;

  @ApiProperty({ type: [AddSkillDto] })
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddSkillDto)
  skills: AddSkillDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  maxNumApplication: number;
}
@InputType()
class AddSkillGqlDto {
  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  skillId: number;

  @Field(() => skillsLevel)
  @IsEnum(skillsLevel)
  level: skillsLevel;
}
@InputType()
export class CreateJobGqlDto {
  @Field(() => String, { name: 'position' })
  @IsString()
  @IsNotEmpty()
  @Length(4, 24)
  position: string;
  @Field(() => String, { name: 'description', nullable: true })
  @IsString()
  @IsOptional()
  @Length(10, 500)
  description?: string;
  @Field(() => jobType, {})
  @IsEnum(jobType)
  type: jobType;

  @Field(() => Location)
  @IsEnum(Location)
  location: Location;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;

  @Field(() => [AddSkillGqlDto])
  @IsArray()
  @IsNotEmpty()
  @Type(() => AddSkillGqlDto)
  @ValidateNested({ each: true })
  skills: AddSkillGqlDto[];

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  maxNumApplication: number;
}
