import { Router } from "express";
import { promoCodeController } from "../controllers/promocode.controller";
import { IsAuthenticatedMiddleware, AuthorizeRoles } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreatePromoCodeDto, UpdatePromoCodeDto } from "../dto/promocode.dto";
import { Role } from "../enum/role.enum";

const router = Router();

const adminAuth = [IsAuthenticatedMiddleware, AuthorizeRoles(Role.ADMIN, Role.SUPER_ADMIN)];

router.post("/", ...adminAuth, ValidationMiddleware(CreatePromoCodeDto), promoCodeController.createGlobalPromo);
router.post("/user/:userId", ...adminAuth, ValidationMiddleware(CreatePromoCodeDto), promoCodeController.createUserPromo);
router.patch("/:id", ...adminAuth, ValidationMiddleware(UpdatePromoCodeDto), promoCodeController.updatePromo);
router.delete("/:id", ...adminAuth, promoCodeController.deactivatePromo);

export default router;
