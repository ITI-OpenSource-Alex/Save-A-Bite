import { Types } from 'mongoose';
import UserNotification, { IUserNotification } from '../models/userNotification';
import Notification from '../models/notification.model';
import NotFoundException from '../exceptions/not-found.exception';
import { NotificationResource } from '../enum/notification.enum';

export class NotificationService {
  public getUserNotifications = async (userId: Types.ObjectId, page: number, pageSize: number, isRead?: boolean) => {
    const skip = (page - 1) * pageSize;

    const filter: any = { user: userId };
    if (isRead !== undefined) {
      filter.isRead = isRead;
    }

    const [notifications, totalCount, totalUnread] = await Promise.all([
      UserNotification.find(filter)
        .populate({
          path: 'notification',
          select: 'message resource resourceId createdAt updatedAt',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),

      UserNotification.countDocuments({ user: userId }),

      UserNotification.countDocuments({ user: userId, isRead: false }),
    ]);

    return {
      page,
      pageSize,
      totalCount,
      totalUnread,
      notifications,
    };
  };
  public markNotificationAsRead = async (userId: Types.ObjectId, notificationId: string): Promise<IUserNotification> => {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    const userNotification = await UserNotification.findOne({
      notification: notification._id,
      user: userId,
    });
    if (!userNotification) {
      throw new Error('Forbidden: could not access this notification');
    }

    userNotification.isRead = true;
    userNotification.readAt = new Date();
    return await userNotification.save();
  };
  public markAllNotificationsAsRead = async (userId: Types.ObjectId): Promise<void> => {
    await UserNotification.updateMany({ user: userId, isRead: false }, { isRead: true, readAt: new Date() });
  };
  public pushNotification = async (userId: Types.ObjectId | string, data: { message: string, resource: NotificationResource, resourceId?: string }) => {
    const notification = await Notification.create(data);
    await UserNotification.create({
      notification: notification._id,
      user: userId,
    });
    return notification;
  }
}