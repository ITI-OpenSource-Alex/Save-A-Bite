import { Router } from "express";
import{ productController } from "../controllers/product.controller";
import { CreateProductDto } from "../dto/product.dto";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";


const router = Router();

router.post('/products', IsAuthenticatedMiddleware, ValidationMiddleware(CreateProductDto), productController.createProduct); // // TODO: NEED TO BE UPDATED AFTER IMPLEMENTING RBAC
router.get('/products', IsAuthenticatedMiddleware, productController.getProducts);
router.get('/products/:id', IsAuthenticatedMiddleware, productController.getProductById)
router.patch('/products/:id', IsAuthenticatedMiddleware, productController.updateProduct)
router.delete('/products/:id', IsAuthenticatedMiddleware, productController.deleteProduct)

export default router;

