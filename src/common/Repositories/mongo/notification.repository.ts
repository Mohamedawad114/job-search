import { Notification, NotificationDocument } from 'src/common/DB';
import { BaseRepository } from './Base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class NotificationRepository extends BaseRepository<NotificationDocument> {
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
  async insert(docs: any): Promise<NotificationDocument> {
    return (await this.notificationModel.insertOne(
      docs,
    )) as unknown as NotificationDocument;
  }
}
