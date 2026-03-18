import { Module } from '@nestjs/common';
import { notificationModel } from 'src/common/DB';
import {  NotificationRepository } from 'src/common';
import { NotificationsServices } from './notification.service';
import { NotificationController } from './notification.controller';


@Module({
  controllers: [NotificationController],
  providers: [NotificationsServices, NotificationRepository],
  imports: [notificationModel],
})
export class NotificationModule {}
