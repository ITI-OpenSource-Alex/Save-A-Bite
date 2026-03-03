import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreateOrderDto } from "../dto/order.dto";

const router = Router();

router.post('/create', IsAuthenticatedMiddleware, ValidationMiddleware(CreateOrderDto), orderController.createOrder);
router.get('/my-orders', IsAuthenticatedMiddleware, orderController.getMyOrders);
router.get('/my-orders/:id', IsAuthenticatedMiddleware, orderController.getOrderById);
router.post('/cancel/:id', IsAuthenticatedMiddleware, orderController.cancelOrder);

export default router;
