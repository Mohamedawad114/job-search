import { JobStatus, jobType, Location, skillsLevel } from '../Enum';
import { ICompany } from './company.interface';

export interface IJob {
  id: number;
  position: string;
  description?: string;
  type: jobType;
  location: Location;
  companyId: number;
  categoryId: number;
  maxNumApplication: number;
  applicationCount: number;
  status: JobStatus;
  company: ICompany;
}

export interface IJobSkills {
  jobId: number;
  skillId: number;
  level: skillsLevel;
}
