import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { StoreDto, UpdateStoreDto } from "../dto/store.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(StoreDto),
  storeController.createStore,
);
router.get("/", IsAuthenticatedMiddleware, storeController.getAllStores);
router.get("/:id", IsAuthenticatedMiddleware, storeController.getStoreById);
router.patch(
  "/:id",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(UpdateStoreDto),
  storeController.updateStoreById,
);
router.delete(
  "/:id",
  IsAuthenticatedMiddleware,
  storeController.deleteStoreById,
);

export default router;
