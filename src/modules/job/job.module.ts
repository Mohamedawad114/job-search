import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import {
  CompanyRepository,
  JobCategoryRepository,
  JobRepository,
} from 'src/common';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    JobRepository,
    JobCategoryRepository,
    CompanyRepository,
  ],
})
export class JobModule {}
