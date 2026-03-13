import { degree } from '../Enum';

export interface IEducation {
  id: number;
  userId: number;
  university: string;
  college: string;
  degree: degree;
  startDate: Date;
  graduationYear: number;
}
