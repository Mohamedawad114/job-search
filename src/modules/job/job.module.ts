import { forwardRef, Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import {
  CompanyRepository,
  JobCategoryRepository,
  JobRepository,
} from 'src/common';
import { rejectedApplicationsModule } from 'src/common/Utils/services';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    JobRepository,
    JobCategoryRepository,
    CompanyRepository,
  ],
  exports:[JobService],
  imports: [forwardRef(()=> rejectedApplicationsModule)],
})
export class JobModule {}
