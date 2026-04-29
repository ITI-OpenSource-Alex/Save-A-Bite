import Redis from 'ioredis';
import env from '../config/env.config';
import { logger } from '../services/logger.service';

export class RedisService {
  static client:Redis;

  public getClient(): Redis {
    try {
      if (RedisService.client) {
        return RedisService.client;
      } else {
        RedisService.client = new Redis({
          host: env.REDIS.HOST,
          port: env.REDIS.PORT,
          password: env.REDIS.PASSWORD,
          //tls: {}, // <-- Add this line to enable TLS
        });
        RedisService.handleClientListeners();
      }

      return RedisService.client;
    } catch (err:any) {
      logger.error('Error connecting to Redis', err);
      throw new Error(`Error connecting to Redis: ${err.message}`);
    }
  }

  private static handleClientListeners() {
    RedisService.client.on('connect', () => {
      logger.info('Connected to Redis successfully!');
    });

    RedisService.client.on('error', (err:any) => {
      logger.error('Error connecting to Redis', err);
    });
  }

  async setValue(key: string, value: string, expiration: number) {
    try {
      if (expiration) {
        await RedisService.client.set(key, value, 'EX', expiration);
      } else {
        await RedisService.client.set(key, value);
      }
      logger.info(`Set key ${key} with value ${value}`);
    } catch (err:any) {
      logger.error(`Error setting key ${key}`, err);
    }
  }

  async getValue(key: string) {
    try {
      const value = await RedisService.client.get(key);
      logger.info(`Get key ${key} returned value ${value}`);
      return value;
    } catch (err) {
      logger.error(`Error getting key ${key}`, err);
    }
  }
async deleteKey(key: string) {
    try {
      const result = await RedisService.client.del(key);
      logger.info(`Deleted key ${key}, result: ${result}`);
      return result;
    } catch (err) {
      logger.error(`Error deleting key ${key}`, err);
    }
  }
  async isExists(key: string) {
    try {
      const value = await RedisService.client.exists(key);
      logger.info(`Get key ${key} returned value ${value}`);
      return value;
    } catch (err) {
      logger.error(`Error checking existence of key ${key}`, err);
    }
  }
}
