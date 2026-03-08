import { Router } from "express";
import { storeController } from "../controllers/store.controller";
import { StoreDto, UpdateStoreDto } from "../dto/store.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { storePolicy } from "../policies/store.policy";
import {AuthorizeRoles} from "../middlewares/abac.middleware"
const router = Router();

router.post(
  "/",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(storePolicy.canCreate),
  ValidationMiddleware(StoreDto),
  storeController.createStore
);
router.get("/", IsAuthenticatedMiddleware, storeController.getAllStores);
router.get("/:id", IsAuthenticatedMiddleware, storeController.getStoreById);
router.patch(
  "/:id",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(storePolicy.canUpdate, storeController.fetchStoreByID),
  ValidationMiddleware(UpdateStoreDto),
  storeController.updateStoreById,
);
router.delete(
  "/:id",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(storePolicy.canDelete, storeController.fetchStoreByID),
  storeController.deleteStoreById,
);
router.delete("/:id", IsAuthenticatedMiddleware, storeController.deleteStoreById);

export default router;
