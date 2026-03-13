import { Module } from '@nestjs/common';
import { JobCatService } from './job-cat.service';
import { JobCategoryRepository, JobRepository } from 'src/common';
import { JobCatController } from './job-cat.controller';

@Module({
  providers: [JobCatService, JobRepository, JobCategoryRepository],
  controllers: [JobCatController],
})
export class JobCatModule {}
