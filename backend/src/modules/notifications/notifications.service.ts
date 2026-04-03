import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifications(userId: string, limit: number, offset: number, unreadOnly: boolean) {
    const where = unreadOnly ? { userId, isRead: false } : { userId };
    const [notifications, total] = await Promise.all([
      this.prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      this.prisma.notification.count({ where }),
    ]);

    return {
      notifications: notifications.map((item) => ({
        id: item.id,
        user_id: item.userId,
        title: item.title,
        message: item.message,
        type: item.type,
        is_read: item.isRead,
        created_at: item.createdAt,
      })),
      pagination: { total, limit, offset },
    };
  }

  async getStats(userId: string) {
    const [total, unread] = await Promise.all([
      this.prisma.notification.count({ where: { userId } }),
      this.prisma.notification.count({ where: { userId, isRead: false } }),
    ]);
    return { total, unread, read: total - unread };
  }

  async markAsRead(userId: string, id: string) {
    const notification = await this.prisma.notification.update({
      where: { id, userId },
      data: { isRead: true },
    });
    return {
      ...notification,
      user_id: notification.userId,
      is_read: notification.isRead,
      created_at: notification.createdAt,
    };
  }

  async markAllAsRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId },
      data: { isRead: true },
    });
    return { success: true };
  }
}
