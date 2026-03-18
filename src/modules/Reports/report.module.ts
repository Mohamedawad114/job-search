import { Module } from '@nestjs/common';
import {
  AIReportRepository,
  AISkillMatchRepository,
  JobRepository,
} from 'src/common';
import { AIReportsServices } from './report.service';
import { AIReportsController } from './report.controller';

@Module({
  providers: [
    JobRepository,
    AIReportRepository,
    AISkillMatchRepository,
    AIReportsServices,
  ],
  controllers: [AIReportsController],
})
export class ReportModule {}
