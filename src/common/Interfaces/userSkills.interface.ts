import { skillsLevel } from '../Enum';

export interface IUserSkills {
  id: number;
  skillId: number;
  level: skillsLevel;
  userId: number;
}
