import {Router} from "express";
import {orderController} from "../controllers/order.controller";

const router = Router()

// routers.use(auth) when auth is provided

router.post('/create', orderController.createOrder)
router.get('/my-orders', orderController.getMyOrders)
router.get('/my-orders/:id', orderController.getOrderById)
router.post('/cancel/:id', orderController.cancelOrder)


export default router
