import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";

const router = Router();

router.post(
  "/",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(CreateProductDto),
  productController.createProduct
); // // TODO: NEED TO BE UPDATED AFTER IMPLEMENTING RBAC
router.get("/", IsAuthenticatedMiddleware, productController.getProducts);
router.get("/:id", IsAuthenticatedMiddleware, productController.getProductById);
router.post(
  "/:storeId",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(CreateProductDto),
  productController.createProduct
);
router.patch(
  "/:id",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(UpdateProductDto),
  productController.updateProduct
);
router.delete("/:id", IsAuthenticatedMiddleware, productController.deleteProduct);

export default router;
