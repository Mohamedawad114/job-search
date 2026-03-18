import { IsEnum, IsOptional } from 'class-validator';
import { skillsLevel } from 'src/common/Enum';

export class UpdateUserSkill {
    @IsEnum(skillsLevel)
      @IsOptional()
  level: skillsLevel;
}
