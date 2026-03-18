import { Module } from '@nestjs/common';
import {
  ApplicationRepository,
  JobRepository,
  NotificationRepository,
} from 'src/common';
import {
  AIJobModule,
  EmailModule,
  rejectedApplicationsModule,
} from 'src/common/Utils/services/index';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { notificationModel } from 'src/common/DB';

@Module({
  providers: [
    JobRepository,
    ApplicationRepository,
    ApplicationService,
    NotificationRepository,
  ],
  imports: [
    EmailModule,
    rejectedApplicationsModule,
    AIJobModule,
    notificationModel,
  ],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
