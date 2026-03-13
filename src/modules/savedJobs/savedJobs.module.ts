import { Module } from '@nestjs/common';
import { JobRepository, SavedJobRepository } from 'src/common';
import { SavedJobService } from './savedJobs.service';
import { SavedJobController } from './savedJobs.controller';

@Module({
  providers: [JobRepository, SavedJobRepository, SavedJobService],
  controllers: [SavedJobController],
})
export class SavedJobModule {}
