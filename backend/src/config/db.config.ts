import mongoose from "mongoose";
import Container from "typedi";
import { Logger } from "../services/logger.service";
import env from "./env.config";

export const dbConnection = async () => {
  const logger = Container.get(Logger);
  try {
    const mongoUri = env.MONGO.URI as string;

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });
    logger.info("📦 MongoDB connected successfully");

    mongoose.connection.on("error", (err) => {
      logger.error("Mongoose connection error", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warning("MongoDB connection lost");
    });
  } catch (error: any) {
    logger.error(
      `Error connecting to MongoDB: ${error.message} - Please check if MongoDB is running and the URI is correct.`,
      error,
    );
    process.exit(1);
  }
};
