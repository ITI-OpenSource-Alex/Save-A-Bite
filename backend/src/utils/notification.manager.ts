import { NotificationResource } from "../enum/notification.enum";
import { UserService } from "../services/user.service";
import Notification from "../models/notification.model";
import UserNotification from "../models/userNotification";
import { pushNotificationToClients, pushToUser } from "./socket";

class NotificationManager {
  private userService = new UserService();

  public async pushBroadcastNotification({
    message,
    resource,
    resourceId,
  }: {
    message: string;
    resource: NotificationResource;
    resourceId?: string;
  }) {
    try {
      // 1. Insert Notification into DB
      const notification = new Notification({
        message,
        resource,
        resourceId,
      });
      const createdNotification = await notification.save();

      // 2. Link all users with this notification (Broadcast)
      const users = await this.userService.getAllUsers();
      const userNotifications = users.map((user: any) => ({
        user: user._id,
        notification: createdNotification._id,
      }));

      await UserNotification.insertMany(userNotifications);

      // 3. Push to all clients
      pushNotificationToClients({
        id: createdNotification._id,
        message,
        resource,
        resourceId,
        createdAt: createdNotification.createdAt,
        updatedAt: createdNotification.updatedAt,
      });

      return createdNotification;
    } catch (error) {
      console.error('[NotificationManager] Error pushing broadcast:', error);
      throw error;
    }
  }

  public async pushToUser(
    userId: string,
    data: { message: string; resource: NotificationResource; resourceId?: string }
  ) {
    try {
      const notification = await Notification.create(data);
      await UserNotification.create({
        notification: notification._id,
        user: userId,
      });

      // Push via socket to the specific user's room
      pushToUser(userId, {
        id: notification._id,
        ...data,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      });

      return notification;
    } catch (error) {
      console.error('[NotificationManager] Error pushing to user:', error);
      throw error;
    }
  }
}

export default NotificationManager;
