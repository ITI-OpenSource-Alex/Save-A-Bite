import { IStore } from "../models/store.model";
import Store from "../models/store.model";
import { logger } from "./logger.service";
import { StoreDto } from "../dto/store.dto";
import mongoose from "mongoose";

export class StoreService {
  constructor() {}

  async createStore(storeData: StoreDto): Promise<IStore> {
    const newStore = new Store(storeData);
    await newStore.save();
    logger.info(`Store created successfully with id:${newStore._id}`);
    return newStore;
  }

  async getAllStores(): Promise<IStore[]> {
    logger.info(`Stores fetched successfully`);
    return await Store.find({ isDeleted: false, isActive: true });
  }

  async getStoreById(storeId: string): Promise<IStore | null> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      logger.warning(`Invalid Store ID: ${storeId}`);
      throw new Error("Invalid Store ID");
    }
    logger.info(`Fetching store with id: ${storeId}`);
    return await Store.findById(storeId);
  }

  async updateStoreById(
    storeId: string,
    updateData: Partial<IStore>,
  ): Promise<IStore | null> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      logger.warning(`Invalid Store ID: ${storeId}`);
      throw new Error("Invalid Store ID");
    }
    logger.info(`Updating store with id: ${storeId}`);
    return await Store.findByIdAndUpdate(storeId, updateData, { new: true });
  }

  async deleteStoreById(storeId: string): Promise<IStore | null> {
    if (!mongoose.Types.ObjectId.isValid(storeId)) {
      logger.warning(`Invalid Store ID: ${storeId}`);
      throw new Error("Invalid Store ID");
    }
    const deletedStore = await Store.findByIdAndUpdate(
      storeId,
      { isDeleted: true },
      { new: true },
    );
    if (!deletedStore) {
      logger.warning(`Store not found: ${storeId}`);
      return null;
    }
    logger.info(`Deleting store with id: ${storeId}`);
    return deletedStore;
  }
}
