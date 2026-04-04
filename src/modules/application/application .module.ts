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
import { GatewayModule } from '../gateway/gateway.module';
import { ApplicationResolver } from './application.resolver';

@Module({
  providers: [
    JobRepository,
    ApplicationRepository,
    ApplicationService,
    NotificationRepository,
    ApplicationResolver,
  ],
  imports: [
    EmailModule,
    rejectedApplicationsModule,
    AIJobModule,
    notificationModel,
    GatewayModule,
  ],
  controllers: [ApplicationController],
})
export class ApplicationModule {}
