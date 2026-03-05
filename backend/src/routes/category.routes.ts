import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { IsAuthenticatedMiddleware } from '../middlewares/auth.middleware';
import { categoryController } from '../controllers/category.controller';
import { categoryDto } from '../dto/category.dto';
// Public endpoints
const router = Router();
router.post('/create', IsAuthenticatedMiddleware, ValidationMiddleware(categoryDto), categoryController.createCategory);
export default router;
