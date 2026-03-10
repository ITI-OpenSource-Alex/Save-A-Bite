import { CronJob } from 'cron';
import { RedisService } from "./redis";
import { logger } from "../services/logger.service";
import NotificationManager from "./notification.manager";
import { NotificationResource } from "../enum/notification.enum";

export enum RedisKeys {
  NOTIFICATIONS = 'notifications_queue',
}

interface NotificationCollectorPayload {
  userId: string;
  message: string;
  resource: NotificationResource;
  resourceId?: string;
}

class NotificationCollector {
  private static instance: NotificationCollector;
  private static job: CronJob | null = null;
  private static jobRunning = false;
  private redisService = new RedisService();
  private redisClient = this.redisService.getClient();
  private notificationManager = new NotificationManager();

  private constructor() {
    this.initializeCronJob();
  }

  public static getInstance(): NotificationCollector {
    if (!NotificationCollector.instance) {
      NotificationCollector.instance = new NotificationCollector();
    }
    return NotificationCollector.instance;
  }

  public async collect(payload: NotificationCollectorPayload): Promise<void> {
    try {
      await this.redisClient.rpush(RedisKeys.NOTIFICATIONS, JSON.stringify(payload));
    } catch (error) {
      logger.error('[NotificationCollector] Failed to add notification to Redis:', error);
    }
  }

  private initializeCronJob(): void {
    if (NotificationCollector.jobRunning) return;

    NotificationCollector.job = new CronJob('*/30 * * * * *', async () => {
      if (NotificationCollector.jobRunning) return;
      NotificationCollector.jobRunning = true;

      try {
        const notificationCount = await this.redisClient.llen(RedisKeys.NOTIFICATIONS);
        if (notificationCount === 0) {
          NotificationCollector.jobRunning = false;
          return;
        }

        logger.info(`[NotificationCollector] Processing ${notificationCount} pending notifications...`);

        const rawNotifications = await this.getNotificationsFromRedis();

        // Group by user, resource, and resourceId to merge messages
        const groups = new Map<string, NotificationCollectorPayload[]>();
        for (const n of rawNotifications) {
          const key = `${n.userId}-${n.resource}-${n.resourceId || 'any'}`;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(n);
        }

        for (const [key, related] of groups.entries()) {
          const first = related[0];
          const count = related.length;

          if (count > 0) {
            const mergedMessage = count === 1 
              ? first.message 
              : `${count} new ${first.resource} updates`;

            await this.notificationManager.pushToUser(first.userId, {
              message: mergedMessage,
              resource: first.resource,
              resourceId: first.resourceId,
            });

            logger.info(`[NotificationCollector] User ${first.userId}: merged ${count} notification(s) pushed.`);
          }
        }

        await this.clearNotificationsFromRedis();
      } catch (error) {
        logger.error('[NotificationCollector] Error during cron job execution:', error);
      } finally {
        NotificationCollector.jobRunning = false;
      }
    });

    NotificationCollector.job.start();
    logger.info('[NotificationCollector] Cron job started.');
  }

  private async getNotificationsFromRedis(): Promise<NotificationCollectorPayload[]> {
    const notifications = await this.redisClient.lrange(RedisKeys.NOTIFICATIONS, 0, -1);
    return notifications.map((n:any) => JSON.parse(n));
  }

  private async clearNotificationsFromRedis(): Promise<void> {
    await this.redisClient.del(RedisKeys.NOTIFICATIONS);
  }
}

export default NotificationCollector;
