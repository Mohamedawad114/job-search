import { Injectable } from '@nestjs/common';
import { IUser, NotificationRepository } from 'src/common';
import { redis, redisKeys } from 'src/common/Utils/services';
@Injectable()
export class NotificationsServices {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  unReadNotifications = async (user: IUser, page: number, limit: number) => {
    const skip = (page - 1) * limit;
    const [notifications, total] = await Promise.all([
      this.notificationRepo.findDocuments(
        { userId: user.id, isRead: false },
        { userId: 0, isRead: 0 },
        { lean: true, limit, skip, sort: { createdAt: -1 } },
      ),
      this.notificationRepo.countDocuments({
        userId: user.id,
        isRead: false,
      }),
    ]);
    Math.ceil(total / limit);
    await this.notificationRepo.updateManyDocuments(
      { userId: user.id, isRead: false },
      { isRead: true },
    );
    if (notifications.length) {
      return {
        message: 'unRead notifications',
        data: { notifications },
        meta: { total, pages: Math.ceil(total / limit) },
      };
    }
    return { message: 'no unRead notifications yet' };
  };
  allReadNotifications = async (user: IUser, page: number, limit: number) => {
    const cached = await redis.get(redisKeys.notification(user.id,page, limit));
    if (cached) {
      const notifications = JSON.parse(cached);
      return {
        data: notifications,
      };
    }
    const skip = (page - 1) * limit;
    const notifications = await this.notificationRepo.findDocuments(
      { userId: user.id, isRead: true },
      { userId: 0 },
      { lean: true, limit, skip, sort: { createdAt: -1 } },
    );
    await redis.set(
      redisKeys.notification(user.id, page, limit),
      JSON.stringify(notifications),
      'EX',
      60 * 60 * 24,
    );
    return { message: 'Read notifications', data: { notifications } };
  };

  delete_Notifications = async (user: IUser) => {
    const notifications = await this.notificationRepo.deleteManyDocuments({
      userId: user.id,
      isRead: true,
    });
    return {
      message: ' notifications deleted',
    };
  };
}
