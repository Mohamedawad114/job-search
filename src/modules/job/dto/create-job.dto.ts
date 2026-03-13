import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { jobType, Location, skillsLevel } from 'src/common';

class AddSkillDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  skillId: number;
  @IsEnum(skillsLevel)
  level: skillsLevel;
}
export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 24)
  position: string;
  @IsString()
  @IsOptional()
  @Length(10, 500)
  description: string;
  @IsEnum(jobType)
  type: jobType;
  @IsEnum(Location)
  location: Location;
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  categoryId: number;
  skills: AddSkillDto[];
}
