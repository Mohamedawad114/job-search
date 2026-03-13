import { IsEnum, IsOptional } from 'class-validator';
import { skillsLevel } from 'src/common';

export class UpdateUserSkill {
    @IsEnum(skillsLevel)
      @IsOptional()
  level: skillsLevel;
}
