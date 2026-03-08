import { Response as ExpressResponse, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { logger } from "../services/logger.service";
import { StoreService } from "../services/store.service";
import { AbacRequest } from "../middlewares/abac.middleware";
// import { error } from "winston";

export class StoreController {
  constructor() {}

  storeService = new StoreService();

  fetchStoreByID = async (req: AbacRequest) => {
    const storeId = req.params.id as string;
    return await this.storeService.getStoreById(storeId);
  };

  createStore = async (req: AbacRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { name, description, phone, email, address, logoUrl, avgRating } = req.body;
      const ownerId = new ObjectId(req.jwt?.userId);
      const storeData = {
        name,
        description,
        phone,
        email,
        address,
        logoUrl,
        ownerId,
        avgRating,
      };
      const newStore = await this.storeService.createStore(storeData);
      res.status(201).json(newStore);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating store: ${error.message}`, error);
      } else {
        logger.error(`Error creating store`, error);
      }
      next(error);
    }
  };

  getAllStores = async (req: AbacRequest, res: ExpressResponse) => {
    try {
      const stores = await this.storeService.getAllStores();
      res.json(stores);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching stores: ${error.message}`, error);
      } else {
        logger.error(`Error fetching stores`, error);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  getStoreById = async (req: AbacRequest, res: ExpressResponse) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const store = req.resource!;
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching store: ${error.message}`, error);
      } else {
        logger.error(`Error fetching store`, error);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  updateStoreById = async (req: AbacRequest, res: ExpressResponse) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const updateData = req.body;
      const updatedStore = await this.storeService.updateStoreById(id, updateData);
      if (!updatedStore) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(updatedStore);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating store: ${error.message}`, error);
      } else {
        logger.error(`Error updating store`, error);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };

  deleteStoreById = async (req: AbacRequest, res: ExpressResponse) => {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const deletedStore = await this.storeService.deleteStoreById(id);
      if (!deletedStore) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(deletedStore);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting store: ${error.message}`, error);
      } else {
        logger.error(`Error deleting store`, error);
      }
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export const storeController = new StoreController();
