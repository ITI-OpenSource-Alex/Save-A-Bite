import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { IsAuthenticatedMiddleware, AuthorizeRoles } from '../middlewares/auth.middleware';
import { Role } from '../enum/role.enum';

const router = Router();

// Only Super Admins and Admins should usually get the full list of users.
// You can remove authorizeRoles if you want users to see each other.
router.get(
  '/',
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN, Role.ADMIN),
  userController.getAllUsers
);

export default router;
