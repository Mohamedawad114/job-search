import { NotificationDocument } from 'src/common/DB';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ConversionRepository extends BaseRepository<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name)
    protected notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
  async updateNotification(
    notification: NotificationDocument,
  ): Promise<NotificationDocument> {
    return await notification.save();
  }
}
@Injectable()
export class MessageRepository extends BaseRepository<NotificationDocument> {
  constructor(
    @InjectModel(Notification.name)
    protected notificationModel: Model<NotificationDocument>,
  ) {
    super(notificationModel);
  }
  async updateNotification(
    notification: NotificationDocument,
  ): Promise<NotificationDocument> {
    return await notification.save();
  }
}
