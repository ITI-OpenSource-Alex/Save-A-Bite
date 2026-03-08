import User from "../models/user.model";
import mongoose from "mongoose";
import { logger } from "../services/logger.service";
import dotenv from "dotenv";
import { Role } from "../enum/role.enum";

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
                logger.info("Super Admin already exists.");
                return;
            }

            const superAdmin = new User({
                name: "Super Admin",
                email: adminEmail,
                password: adminPassword,
                role: Role.SUPER_ADMIN,
                isEmailVerified: true,
                isActive: true
            });

            await superAdmin.save();
            logger.info("Super Admin seeded successfully.");
        } catch (error: any) {
            if (error.message.includes("requires authentication")) {
                logger.error("Authentication failed. Please check your MONGO_URI in .env to ensure it includes the correct username and password.", error);
            } else {
                logger.error("Error seeding Super Admin:", error);
            }
        }
    }


    static async seedTestUsers() {
        if (process.env.NODE_ENV === 'production') {
            logger.warning("Attempted to seed test users in a production environment. Aborting.");
            return;
        }

        const testUsers = [
            {
                name: "Test Admin",
                email: "admin@test.com",
                password: "password123", 
                role: Role.ADMIN,
                isEmailVerified: true,
                isActive: true
            },
            {
                name: "Test Vendor",
                email: "vendor@test.com",
                password: "password123",
                role: Role.VENDOR,
                isEmailVerified: true,
                isActive: true
            },
            {
                name: "Test User",
                email: "user@test.com",
                password: "password123",
                role: Role.USER,
                isEmailVerified: true,
                isActive: true
            }
        ];

        try {
            for (const userData of testUsers) {
                const existingUser = await User.findOne({ email: userData.email });
                
                if (existingUser) {
                    logger.info(`Test ${userData.role} already exists (${userData.email}). Skipping.`);
                    continue;
                }

                await User.create(userData);
                logger.info(`Test ${userData.role} seeded successfully (${userData.email}).`);
            }
        } catch (error: any) {
            logger.error("Error seeding test users:", error);
        }
    }


    static async runAllSeeds() {
        logger.info("Starting database seeding process...");
        
        await this.seedSuperAdmin();
        await this.seedTestUsers();
        
        logger.info("Database seeding process completed.");
    }
}
