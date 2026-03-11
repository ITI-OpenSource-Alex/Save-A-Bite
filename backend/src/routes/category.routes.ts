import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import ValidationMiddleware from '../middlewares/validation.middleware';
import { IsAuthenticatedMiddleware } from '../middlewares/auth.middleware';
import  categoryController  from '../controllers/category.controller';
import { CategoryDto } from '../dto/category.dto';
import { AuthorizeRoles } from '../middlewares/abac.middleware';
import { categoryPolicy } from '../policies/category.policy';
// Public endpoints
const router = Router();
router.post('/create', IsAuthenticatedMiddleware, AuthorizeRoles(categoryPolicy.canCreate),ValidationMiddleware(CategoryDto), categoryController.createCategory);
router.get('/list', IsAuthenticatedMiddleware, AuthorizeRoles(categoryPolicy.canRead),categoryController.list);
router.get('/details/:id', IsAuthenticatedMiddleware,  AuthorizeRoles(categoryPolicy.canRead),categoryController.details);
router.put('/update/:id', IsAuthenticatedMiddleware,   AuthorizeRoles(categoryPolicy.canUpdate),categoryController.update);
router.delete('/delete/:id', IsAuthenticatedMiddleware,  AuthorizeRoles(categoryPolicy.canDelete),categoryController.softDelete);
export default router;
