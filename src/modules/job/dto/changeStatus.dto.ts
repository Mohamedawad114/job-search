import { IsEnum } from 'class-validator';
import { JobStatus } from 'src/common';

export class ChangeStatus {
  @IsEnum(JobStatus)
  status: JobStatus;
}
