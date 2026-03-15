import User from "../models/user.model";
import mongoose from "mongoose";
import { logger } from "../services/logger.service";
import dotenv from "dotenv";
import { Role } from "../enum/role.enum";

import { Product } from "../models/product.model";
import { Category } from "../models/category.model";
import Store from "../models/store.model";

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
      if (error.message && error.message.includes("requires authentication")) {
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

  static async seedCategories() {
    const categories = [
      { name: "Fast Food", icon: "🍔" },
      { name: "Bakery", icon: "🥐" },
      { name: "Japanese", icon: "🍣" },
      { name: "Pizza", icon: "🍕" },
      { name: "Desserts", icon: "🍰" },
      { name: "Beverages", icon: "🥤" },
    ];

    try {
      await Category.deleteMany({});
      for (const cat of categories) {
        const randomStock = Math.floor(Math.random() * 90) + 10;
        await Category.create({
          ...cat,
          categoryStock: randomStock
        });
        logger.info(`Category ${cat.name} seeded with stock ${randomStock}.`);
      }
    } catch (error) {
      logger.error("Error seeding categories:", error);
    }
  }

  static async seedStores() {
    try {
      const vendorUser = await User.findOne({ email: "vendor@test.com" });
      if (!vendorUser) {
        logger.warning("Test vendor user not found. Skipping store seeding.");
        return;
      }

      const stores = [
        {
          name: "McDonald's",
          description: "Think globally, act locally. Enjoy our surplus meals at great prices.",
          ownerId: vendorUser._id,
          phone: "01000100010",
          email: "support@mcdonalds.eg",
          logoUrl: "https://upload.wikimedia.org/wikipedia/commons/3/36/McDonald%27s_Golden_Arches.svg",
          avgRating: 4.5,
          countRatings: 120,
        },
        {
          name: "KFC",
          description: "Finger Lickin' Good surplus. Save our crispy chicken from missing out.",
          ownerId: vendorUser._id,
          phone: "01000100011",
          email: "info@kfc.eg",
          logoUrl: "https://pngimg.com/d/kfc_PNG50.png",
          avgRating: 4.2,
          countRatings: 95,
        },
        {
          name: "Mori sushi",
          description: "Help us reduce waste by enjoying our day-end sushi.",
          ownerId: vendorUser._id,
          phone: "01000100012",
          email: "info@mori.com",
          logoUrl: "https://ucarecdn.com/66d4de43-00d2-4657-8f05-1e7728d17fbb/-/scale_crop/870x500/",
          avgRating: 4.6,
          countRatings: 250,
        },
        {
          name: "Salé Sucré",
          description: "Artisanal French pastries and oriental sweets. Saving the finest cakes.",
          ownerId: vendorUser._id,
          phone: "01000100014",
          email: "contact@salesucre.com",
          logoUrl: "https://www.salesucre.com/images/placeholder.webp",
          avgRating: 4.9,
          countRatings: 310,
        },
        {
          name: "Abdel Rahim Koueider",
          description: "Artisanal French pastries and oriental sweets. Saving the finest cakes.",
          ownerId: vendorUser._id,
          phone: "01000100015",
          email: "contact@koueider.com",
          logoUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyQGKdZFPczM6HFbabPctfDlY8zvdXVT85XQ&s",
          avgRating: 4.9,
          countRatings: 310,
        },
      ];

      await Store.deleteMany({});
      for (const storeData of stores) {
        await Store.create(storeData);
        logger.info(`Store ${storeData.name} seeded.`);
      }
    } catch (error) {
      logger.error("Error seeding stores:", error);
    }
  }

  static async seedProducts() {
    try {
      const fastFoodCat = await Category.findOne({ name: "Fast Food" });
      const bakeryCat = await Category.findOne({ name: "Bakery" });
      const japaneseCat = await Category.findOne({ name: "Japanese" });
      const dessertsCat = await Category.findOne({ name: "Desserts" });
      const beveragesCat = await Category.findOne({ name: "Beverages" });
      
      const mcdonalds = await Store.findOne({ name: "McDonald's" });
      const kfc = await Store.findOne({ name: "KFC" });
      const moriSushi = await Store.findOne({ name: "Mori sushi" });
      const saleSucre = await Store.findOne({ name: "Salé Sucré" });
      const koueider = await Store.findOne({ name: "Abdel Rahim Koueider" });

      if (!mcdonalds || !kfc || !moriSushi || !saleSucre || !koueider || !fastFoodCat || !dessertsCat || !japaneseCat) {
        logger.warning("Necessary stores/categories not found. skipping product seeding.");
        return;
      }

      const mockProducts = [
        // McDonald's
        {
          name: "Big Mac Combo",
          storeId: mcdonalds._id,
          categoryId: fastFoodCat._id,
          images: ["https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80"],
          price: 150,
          stock: 10,
          description: "The classic Big Mac burger with medium fries and a drink.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 50,
        },
        {
          name: "McFlurry Oreo",
          storeId: mcdonalds._id,
          categoryId: dessertsCat?._id,
          images: ["https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80"],
          price: 60,
          stock: 25,
          description: "Vanilla soft serve with Oreo cookie pieces.",
          isActive: true,
          isFlashDeal: false,
          discountPercentage: 0,
        },
        // KFC
        {
          name: "Zinger Sandwich",
          storeId: kfc._id,
          categoryId: fastFoodCat._id,
          images: ["https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=500&q=80"],
          price: 120,
          stock: 20,
          description: "Spicy Zinger chicken sandwich with lettuce and mayo.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 40,
        },
        {
          name: "Mighty Zinger Box",
          storeId: kfc._id,
          categoryId: fastFoodCat._id,
          images: ["https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=500&q=80"],
          price: 180,
          stock: 15,
          description: "Double the spice, double the crunch with fries and a drink.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 30,
        },
        // Mori Sushi
        {
          name: "California Roll (8pcs)",
          storeId: moriSushi._id,
          categoryId: japaneseCat._id,
          images: ["https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&q=80"],
          price: 220,
          stock: 8,
          description: "Crab, avocado, and cucumber with tobiko.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 35,
        },
        {
          name: "Salmon Nigiri Platter",
          storeId: moriSushi._id,
          categoryId: japaneseCat._id,
          images: ["https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&q=80"],
          price: 350,
          stock: 5,
          description: "Fresh salmon over pressed vinegar rice.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 20,
        },
        // Salé Sucré
        {
          name: "Mixed Mini Tarts Box",
          storeId: saleSucre._id,
          categoryId: dessertsCat._id,
          images: ["https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80"],
          price: 300,
          stock: 12,
          description: "Assorted fruit and chocolate mini tarts.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 45,
        },
        {
          name: "Chocolate Eclair",
          storeId: saleSucre._id,
          categoryId: bakeryCat?._id || dessertsCat._id,
          images: ["https://md-backend.koueider.com/wp-content/uploads/2024/02/%D8%A5%D9%83%D9%84%D9%8A%D8%B1-%D9%86%D9%8A%D9%88%D8%AA%D9%8A%D9%84%D8%A7-2-gall.jpg"],
          price: 45,
          stock: 20,
          description: "Choux pastry filled with cream and topped with chocolate glaze.",
          isActive: true,
          isFlashDeal: false,
          discountPercentage: 0,
        },
        // Abdel Rahim Koueider
        {
          name: "Basbousa with Nuts",
          storeId: koueider._id,
          categoryId: dessertsCat._id,
          images: ["https://cdn.mafrservices.com/sys-master-root/hc0/ha0/62397758406686/401256_main.jpg"], // Using proxy if needed
          price: 180,
          stock: 15,
          description: "Traditional semolina cake with honey syrup and almonds.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 25,
        },
        {
          name: "Kunafa with Cream",
          storeId: koueider._id,
          categoryId: dessertsCat._id,
          images: ["https://md-backend.koueider.com/wp-content/uploads/2024/01/4002001-gall-1.jpg"],
          price: 200,
          stock: 10,
          description: "Shredded pastry with a rich cream filling and syrup.",
          isActive: true,
          isFlashDeal: true,
          discountPercentage: 30,
        },
        // Beverages
        {
          name: "Fresh Orange Juice",
          storeId: saleSucre._id,
          categoryId: beveragesCat?._id,
          images: ["https://images.unsplash.com/photo-1547514701-42782101795e?w=500&q=80"],
          price: 50,
          stock: 40,
          description: "100% natural freshly squeezed orange juice.",
          isActive: true,
          isFlashDeal: false,
          discountPercentage: 0,
        }
      ];

      await Product.deleteMany({});
      await Product.insertMany(mockProducts);
      logger.info("Products seeded successfully.");
    } catch (error) {
      logger.error("Error seeding products:", error);
    }
  }

  static async runAllSeeds() {
    logger.info("Starting database seeding process...");

    await this.seedSuperAdmin();
    await this.seedTestUsers();
    await this.seedCategories();
    await this.seedStores();
    await this.seedProducts();

    logger.info("Database seeding process completed.");
  }
}
