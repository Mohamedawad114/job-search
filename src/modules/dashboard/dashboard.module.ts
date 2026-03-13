import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  EmailModule,
  JobCategoryRepository,
  SkillRepository,
  UserRepository,
  WorkTypeRepository,
} from 'src/common';
import { UserDashboard } from './dashboardUser.service';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    WorkTypeRepository,
    SkillRepository,
    UserRepository,
    JobCategoryRepository,
    UserDashboard,
  ],
  imports: [EmailModule],
})
export class DashboardModule {}
