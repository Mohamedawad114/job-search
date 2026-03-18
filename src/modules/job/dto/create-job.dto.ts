import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Length,
} from 'class-validator';
import { jobType, Location, skillsLevel } from 'src/common/Enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  skills: AddSkillDto[];

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  maxNumApplication: number;
}
