import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IUserSkills } from 'src/common';
import { skillsLevel } from 'src/common/Enum';
import { ApiProperty } from '@nestjs/swagger';

export class AddUserSkill implements Partial<IUserSkills> {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  skillId: number;

  @ApiProperty({ enum: skillsLevel })
  @IsEnum(skillsLevel)
  level: skillsLevel;
}
