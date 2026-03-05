import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { StoreDto, UpdateStoreDto } from "../dto/store.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/stores",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(StoreDto),
  storeController.createStore,
);
router.get("/stores", IsAuthenticatedMiddleware, storeController.getAllStores);
router.get(
  "/stores/:id",
  IsAuthenticatedMiddleware,
  storeController.getStoreById,
);
router.patch(
  "/stores/:id",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(UpdateStoreDto),
  storeController.updateStoreById,
);
router.delete(
  "/stores/:id",
  IsAuthenticatedMiddleware,
  storeController.deleteStoreById,
);
