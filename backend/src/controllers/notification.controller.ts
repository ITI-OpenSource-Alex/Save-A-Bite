import { NextFunction, Response, Request } from 'express';
import mongoose from 'mongoose';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../middlewares/auth.middleware';

export class NotificationController {
  public notificationService: NotificationService;
  constructor() {
    this.notificationService = new NotificationService();
  }
  public getNotifications = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id as mongoose.Types.ObjectId;
      const page = req.paginationOpts?.page || 1;
      const pageSize = req.paginationOpts?.pageSize || 5;
      let isReadParam: boolean | undefined = undefined;

      if (req.query.isRead) {
        isReadParam = req.query.isRead === 'true';
      }
      const data = await this.notificationService.getUserNotifications(userId, page, pageSize, isReadParam);

      res.status(200).json(data);
    } catch (error) {
      console.error('Error in getNotifications:', error);
      next(error);
    }
  };
  public markNotificationAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id as mongoose.Types.ObjectId;
      const notificationId = req.params.notificationId as string;

      await this.notificationService.markNotificationAsRead(userId, notificationId);

      res.status(200).json({
        message: 'Notification marked as read',
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      next(error);
    }
  };
  public markAllNotificationsAsRead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user!._id as mongoose.Types.ObjectId;

      await this.notificationService.markAllNotificationsAsRead(userId);

      res.status(200).json({
        message: 'All notifications marked as read',
      });
    } catch (error) {
      next(error);
    }
  };
}