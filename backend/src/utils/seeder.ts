import User from "../models/user.model";
import { logger } from "../services/logger.service";
import dotenv from "dotenv";

dotenv.config();

export class Seeder {
    static async seedSuperAdmin() {
        try {
            const adminEmail = process.env.SUPER_ADMIN_EMAIL;
            const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

            if (!adminEmail || !adminPassword) {
                logger.warning("Super Admin credentials not found in environment variables. Skipping seeding.");
                return;
            }

            const existingAdmin = await User.findOne({ email: adminEmail });

            if (existingAdmin) {
                logger.info("Super Admin already exists. Skipping seeding.");
                return;
            }

            const superAdmin = new User({
                name: "Super Admin",
                email: adminEmail,
                password: adminPassword,
                role: "super-admin",
                isEmailVerified: true,
                isActive: true
            });

            await superAdmin.save();
            logger.info("Super Admin seeded successfully.");
        } catch (error) {
            logger.error("Error seeding Super Admin:", error);
        }
    }
}
