import { IsEnum, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { IUserSkills, skillsLevel } from 'src/common';

export class AddUserSkill implements Partial<IUserSkills> {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  skillId: number;
  @IsEnum(skillsLevel)
  level: skillsLevel;
}
