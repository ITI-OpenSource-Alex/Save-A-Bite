import { Order, IOrder } from '../models/order.model';
import mongoose from 'mongoose';
import { logger } from './logger.service';

export class OrderService {
  constructor() {}

  async createOrder(orderData: any, userId: string, idempotencyKey: string): Promise<IOrder> {
    const existingOrder = await Order.findOne({ idempotencyKey, userId });
    if (existingOrder) {
      logger.info(`Order with idempotency key ${idempotencyKey} already exists`);
      return existingOrder;
    }

    const newOrder = new Order({
      ...orderData,
      userId,
      idempotencyKey,
      status: 'PLACED',
      paymentStatus: 'PENDING',
    });

    await newOrder.save();
    logger.info(`Order created successfully of user id:${newOrder.userId}`);
    return newOrder;
  }

  async getMyOrders(userId: string): Promise<IOrder[]> {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    logger.info(`Orders fetched successfully of user id:${userId}`);
    return orders;
  }

  async getOrderById(orderId: string, userId: string): Promise<IOrder | null> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      logger.error(`Invalid Order ID: ${orderId}`, null);
      throw new Error('Invalid Order ID');
    }

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) {
      logger.error(`Order not found: ${orderId}`, null);
      return null;
    }

    return order;
  }

  async cancelOrder(orderId: string, userId: string): Promise<IOrder | null> {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      logger.error(`Invalid Order ID: ${orderId}`, null);
      throw new Error('Invalid Order ID');
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      logger.error(`Order not found: ${orderId}`, null);
      return null;
    }

    if (order.status !== 'PLACED' && order.status !== 'PROCESSING') {
      logger.error(`Cannot cancel an order with status: ${order.status}`, null);
      throw new Error(`Cannot cancel an order with status: ${order.status}`);
    }

    order.status = 'CANCELLED';
    await order.save();

    logger.info(`Order cancelled successfully of user id:${userId}`);
    return order;
  }
}
