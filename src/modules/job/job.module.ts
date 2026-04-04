import { forwardRef, Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import {
  CompanyRepository,
  JobCategoryRepository,
  JobRepository,
} from 'src/common';
import { rejectedApplicationsModule } from 'src/common/Utils/services';
import { JobResolver } from './job.resolver';

@Module({
  controllers: [JobController],
  providers: [
    JobService,
    JobRepository,
    JobCategoryRepository,
    CompanyRepository,
    JobResolver
  ],
  exports: [JobService],
  imports: [forwardRef(() => rejectedApplicationsModule)],
})
export class JobModule {}
