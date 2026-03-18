import { Injectable, NotFoundException } from '@nestjs/common';
import {
  emailType,
  notificationHandler,
  NotificationRepository,
  NotificationType,
  UserRepository,
} from 'src/common';
import { changeRoleDto } from './Dto';
import { EmailProducer, redis } from 'src/common/Utils/services';

@Injectable()
export class UserDashboard {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly emailQueue: EmailProducer,
    private readonly NotificationRepo: NotificationRepository,
  ) {}
  BanUser = async (userId: number) => {
    const User = await this.userRepo.findById(userId);
    if (!User) throw new NotFoundException('user not found');
    await this.userRepo.updateById(User._id, { isBaned: true });
    await redis.sadd('banned_users', userId.toString());
    await this.emailQueue.sendEmailJob(emailType.BanedUser, User.email);
    return { message: 'user banned successfully' };
  };
  unBanUser = async (userId: number) => {
    const isBanned = await redis.sismember('banned_users', userId.toString());
    if (!isBanned) throw new NotFoundException('user not banned');
    await this.userRepo.updateById(userId, { isBaned: false });
    await redis.srem('banned_users', userId.toString());
    return { message: 'user unbanned successfully' };
  };
  BannedUsers = async (page: number, limit: number) => {
    const offset = (page - 1) * limit;
    const userIds: string[] = await redis.smembers('banned_users');
    const total = await redis.scard('banned_users');
    if (!userIds.length) {
      return {
        message: 'No banned users',
        data: [],
        page,
        limit,
        total,
        totalPages: 0,
      };
    }
    const bannedUsers = await this.userRepo.findAll({
      where: { id: { in: userIds } },
      select: { name: true, email: true, profilePicture: true },
      skip: offset,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
    return {
      message: 'Banned users',
      data: bannedUsers,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  };
  changeRole = async (userId: number, data: changeRoleDto) => {
    const User = await this.userRepo.findById(userId);
    if (!User) throw new NotFoundException('user not found');
    await this.userRepo.updateById(User.id, { role: data.role });
    const { title, content } = notificationHandler(
      NotificationType.ROLE_CHANGED_TO_ADMIN,
      {},
    );
    const Notifications = await this.NotificationRepo.insert({
      userId: userId,
      title: title,
      content: content,
    });
    //socket

    return {
      message: 'user role updated',
    };
  };
}
