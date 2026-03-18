import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import {
  JobCategoryRepository,
  NotificationRepository,
  SkillRepository,
  UserRepository,
  WorkTypeRepository,
} from 'src/common';
import { EmailModule } from 'src/common/Utils/services';
import { UserDashboard } from './dashboardUser.service';
import { notificationModel } from 'src/common/DB';

@Module({
  controllers: [DashboardController],
  providers: [
    DashboardService,
    WorkTypeRepository,
    SkillRepository,
    UserRepository,
    JobCategoryRepository,
    UserDashboard,
    NotificationRepository,
  ],
  imports: [EmailModule, notificationModel],
})
export class DashboardModule {}
