import { Router } from "express";
import { cartController } from "../controllers/cart.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { AddItemDto, UpdateItemDto, ApplyPromoCodeDto } from "../dto/cart.dto";

const router = Router();

router.get('/', IsAuthenticatedMiddleware, cartController.getCart);
router.post('/add-item', IsAuthenticatedMiddleware, ValidationMiddleware(AddItemDto), cartController.addItem);
router.patch('/update-item', IsAuthenticatedMiddleware, ValidationMiddleware(UpdateItemDto), cartController.updateItem);
router.delete('/remove-item/:productId', IsAuthenticatedMiddleware, cartController.removeItem);
router.delete('/clear', IsAuthenticatedMiddleware, cartController.clearCart);
router.post('/apply-promocode', IsAuthenticatedMiddleware, ValidationMiddleware(ApplyPromoCodeDto), cartController.applyPromoCode);
router.delete('/remove-promocode', IsAuthenticatedMiddleware, cartController.removePromoCode);

export default router;
