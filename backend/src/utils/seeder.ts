import User from '../models/user.model';
import mongoose from 'mongoose';
import { logger } from '../services/logger.service';
import dotenv from 'dotenv';
import { Role } from '../enum/role.enum';

dotenv.config();

export class Seeder {
  static async seedSuperAdmin() {
    try {
      const adminEmail = process.env.SUPER_ADMIN_EMAIL;
      const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        logger.warning(
          'Super Admin credentials not found in environment variables. Skipping seeding.'
        );
        return;
      }

      const existingAdmin = await User.findOne({ email: adminEmail });

      if (existingAdmin) {
        logger.info('Super Admin already exists.');
        return;
      }

      const superAdmin = new User({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: Role.SUPER_ADMIN,
        isEmailVerified: true,
        isActive: true,
      });

      await superAdmin.save();
      logger.info('Super Admin seeded successfully.');
    } catch (error: any) {
      if (error.message.includes('requires authentication')) {
        logger.error(
          'Authentication failed. Please check your MONGO_URI in .env to ensure it includes the correct username and password.',
          error
        );
      } else {
        logger.error('Error seeding Super Admin:', error);
      }
    }
  }
}
