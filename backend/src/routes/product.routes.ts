import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { AuthorizeRoles } from "../middlewares/abac.middleware";
import { productPolicy } from "../policies/product.policy";

const router = Router();


router.get("/", IsAuthenticatedMiddleware, productController.getProducts);
router.get("/:id", IsAuthenticatedMiddleware,AuthorizeRoles(productPolicy.canRead, productController.fetchProductByID), productController.getProductById);
router.post(
  "/:storeId",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(productPolicy.canCreate),
  ValidationMiddleware(CreateProductDto),
  productController.createProduct
);
router.patch(
  "/:id",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(productPolicy.canUpdate, productController.fetchProductByID),
  ValidationMiddleware(UpdateProductDto),
  productController.updateProduct,
);
router.delete(
  "/:id",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(productPolicy.canDelete, productController.fetchProductByID),
  productController.deleteProduct,
);
router.delete("/:id", IsAuthenticatedMiddleware, productController.deleteProduct);

export default router;
