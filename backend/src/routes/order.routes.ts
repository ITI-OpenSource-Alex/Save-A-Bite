import { Router, Response as ExpressResponse, NextFunction } from "express";
import { orderController } from "../controllers/order.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreateOrderDto } from "../dto/order.dto";
import { orderPolicy} from "../policies/order.policy";
import { AuthorizeABAC, AbacRequest } from "../middlewares/abac.middleware";
const router = Router();

router.post('/', IsAuthenticatedMiddleware, ValidationMiddleware(CreateOrderDto), orderController.createOrder)

router.get('/', IsAuthenticatedMiddleware, orderController.getMyOrders);

router.get('/:id', IsAuthenticatedMiddleware, AuthorizeABAC(orderPolicy.canRead, orderController.fetchOrderByID) , orderController.getOrderById);

router.post('/:id', IsAuthenticatedMiddleware, AuthorizeABAC(orderPolicy.canCancel, orderController.fetchOrderByID),orderController.cancelOrder);

export default router;
