import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreateOrderDto } from "../dto/order.dto";

const router = Router();

router.post(
  "/orders",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(CreateOrderDto),
  orderController.createOrder,
);
router.get("/orders", IsAuthenticatedMiddleware, orderController.getMyOrders);
router.get(
  "/orders/:id",
  IsAuthenticatedMiddleware,
  orderController.getOrderById,
);
router.post(
  "/orders/:id",
  IsAuthenticatedMiddleware,
  orderController.cancelOrder,
);

export default router;
