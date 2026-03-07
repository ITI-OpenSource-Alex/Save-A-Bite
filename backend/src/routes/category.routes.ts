import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import categoryController from "../controllers/category.controller";
import { CategoryDto } from "../dto/category.dto";

// Public endpoints
const router = Router();
router.post(
  "/create",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(CategoryDto),
  categoryController.createCategory
);
router.get("/list", IsAuthenticatedMiddleware, categoryController.list);
router.get("/details/:id", IsAuthenticatedMiddleware, categoryController.details);
router.put("/update/:id", IsAuthenticatedMiddleware, categoryController.update);
router.delete("/delete/:id", IsAuthenticatedMiddleware, categoryController.softDelete);
export default router;
