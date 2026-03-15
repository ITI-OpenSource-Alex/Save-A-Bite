import User from "../models/user.model";
import mongoose from "mongoose";
import { logger } from "../services/logger.service";
import dotenv from "dotenv";
import { Role } from "../enum/role.enum";

import { Product } from "../models/product.model";

dotenv.config();

export class Seeder {
  static async seedSuperAdmin() {
    try {
      const adminEmail = process.env.SUPER_ADMIN_EMAIL;
      const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        logger.warning(
          "Super Admin credentials not found in environment variables. Skipping seeding."
        );
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
        isActive: true,
      });

      await superAdmin.save();
      logger.info("Super Admin seeded successfully.");
    } catch (error: any) {
      if (error.message.includes("requires authentication")) {
        logger.error(
          "Authentication failed. Please check your MONGO_URI in .env to ensure it includes the correct username and password.",
          error
        );
      } else {
        logger.error("Error seeding Super Admin:", error);
      }
    }
  }

  static async seedTestUsers() {
    if (process.env.NODE_ENV === "production") {
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
        isActive: true,
      },
      {
        name: "Test Vendor",
        email: "vendor@test.com",
        password: "password123",
        role: Role.VENDOR,
        isEmailVerified: true,
        isActive: true,
      },
      {
        name: "Test User",
        email: "user@test.com",
        password: "password123",
        role: Role.USER,
        isEmailVerified: true,
        isActive: true,
      },
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
  
  static async seedProducts() {
    // Implement product seeding logic here
    const dummyStoreId1 = new mongoose.Types.ObjectId();
    const dummyStoreId2 = new mongoose.Types.ObjectId();
    const dummyCategoryId1 = new mongoose.Types.ObjectId(); // e.g., Fast Food
    const dummyCategoryId2 = new mongoose.Types.ObjectId(); // e.g., Bakery

    const mockProducts = [
      {
        name: "Alexandrian Liver Sandwich Combo",
        storeId: dummyStoreId1,
        categoryId: dummyCategoryId1,
        images: ["https://images.unsplash.com/photo-1619881589316-56c7f9e6b587?w=500&q=80"],
        price: 150,
        stock: 20,
        description:
          "Authentic spicy Alexandrian liver sandwiches with tahini and pickles. Rescued just in time for a perfect late lunch!",
        isActive: true,
        isFlashDeal: true,
        discountPercentage: 40,
      },
      {
        name: "Surprise Bakery Box",
        storeId: dummyStoreId2,
        categoryId: dummyCategoryId2,
        images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80"],
        price: 200,
        stock: 5,
        description:
          "A mixed box of today's unsold croissants, baguettes, and sweet pastries. High value, low price.",
        isActive: true,
        isFlashDeal: false,
        discountPercentage: 0, // No discount, standard item
      },
      {
        name: "Seafood Pasta Surplus",
        storeId: dummyStoreId1,
        categoryId: dummyCategoryId1,
        images: ["https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80"],
        price: 350,
        stock: 12,
        description:
          "Fresh pasta with shrimp, calamari, and red sauce. Over-prepped by the kitchen and ready to save!",
        isActive: true,
        isFlashDeal: true,
        discountPercentage: 50, // Massive flash deal
      },
      {
        name: "Sold Out Sushi Platter",
        storeId: dummyStoreId2,
        categoryId: dummyCategoryId1,
        images: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"],
        price: 500,
        stock: 0, // Perfect for testing your "Out of Stock" button in the cart
        description: "24-piece assorted sushi platter. Sorry, someone already rescued this bite!",
        isActive: true,
        isFlashDeal: false,
      },
    ];
    const seedDB = async () => {
      try {
        // Connect to your local DB or Atlas
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log(" Connected to Database");

        // Clear old products to avoid duplicates
        await Product.deleteMany({});
        console.log(" Cleared old products");

        // Insert the mock data
        await Product.insertMany(mockProducts);
        console.log(" Beautiful food products seeded successfully!");

      } catch (error) {
        console.error(" Error seeding products:", error);
      }
    };
    seedDB();
  }
    

  static async runAllSeeds() {
    logger.info("Starting database seeding process...");

    await this.seedSuperAdmin();
    await this.seedTestUsers();
    await this.seedProducts();

    logger.info("Database seeding process completed.");
  }
}
