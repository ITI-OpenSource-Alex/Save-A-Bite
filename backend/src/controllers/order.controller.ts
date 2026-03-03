import { Response as ExpressResponse, NextFunction } from "express";
import { OrderService } from "../services/order.service";
import { logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateOrderDto } from "../dto/order.dto";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createOrder = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const idempotencyKey = req.headers["idempotency-key"] as string;
      const userId = req.jwt?.userId;
      const orderData: CreateOrderDto = req.body;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!idempotencyKey) {
        return res.status(400).json({ message: "idempotency-key header is required" });
      }

      const order = await this.orderService.createOrder(req.body, userId, idempotencyKey);
      
      const status = order.createdAt === order.updatedAt ? 201 : 200;
      const message = status === 201 ? "Order created successfully" : "Order already processed";
      
      return res.status(status).json({ message, order });
    } catch (error: any) {
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };

  getMyOrders = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      const orders = await this.orderService.getMyOrders(userId);
      return res.status(200).json({ orders });
    } catch (error: any) {
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getOrderById = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const orderId = req.params.id as string;
      const userId = req.jwt?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await this.orderService.getOrderById(orderId, userId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ order });
    } catch (error: any) {
      if (error.message === "Invalid Order ID") {
        return res.status(400).json({ message: error.message });
      }
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  cancelOrder = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const orderId = req.params.id as string;
      const userId = req.jwt?.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const order = await this.orderService.cancelOrder(orderId, userId);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      return res.status(200).json({ message: "Order cancelled successfully", order });
    } catch (error: any) {
      if (error.message === "Invalid Order ID" || error.message.startsWith("Cannot cancel")) {
        return res.status(400).json({ message: error.message });
      }
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export const orderController = new OrderController();

