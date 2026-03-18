import { JobStatus, jobType, Location } from '../Enum';

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
}
