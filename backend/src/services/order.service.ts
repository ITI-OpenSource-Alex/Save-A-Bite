import { Order, IOrder } from "../models/order.model";
import mongoose from "mongoose";
import { logger } from "./logger.service";

import { getIo } from "../utils/socket"; 
import { sendInvoiceEmail } from "../send-mails/emailService"; 

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
            paymentStatus: 'PENDING'
        });

        await newOrder.save();
        logger.info(`Order created successfully of user id:${newOrder.userId}`);

        try {
            const io = getIo();
            io.to(userId).emit('orderStatusChanged', {
                orderId: newOrder._id,
                status: newOrder.status,
                message: 'Your order has been placed successfully!'
            });
        } catch (error) {
            logger.error(`WebSocket Error: Failed to emit PLACED status for order ${newOrder._id}`, error);
        }


        try {
            const user = await mongoose.model('User').findById(userId); 

            if (user && user.email) {
                await sendInvoiceEmail(
                    user.email, 
                    newOrder._id.toString(), 
                    newOrder.totalPrice 
                );
              //  console.log(`Invoice email sent successfully to ${user.email} for order ${newOrder._id}`);
            } else {
                logger.error(`Could not find email address for user ID: ${userId}`, null);
            }
        } catch (error) {
            logger.error(`Email Error: Failed to send invoice for order ${newOrder._id}`, error );
        }

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
            throw new Error("Invalid Order ID");
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
            throw new Error("Invalid Order ID");
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

        try {
            const io = getIo();
            io.to(userId).emit('orderStatusChanged', {
                orderId: order._id,
                status: order.status,
                message: 'Your order has been cancelled.'
            });
        } catch (error) {
            logger.error(`WebSocket Error: Failed to emit CANCELLED status for order ${order._id}`, error);
        }

        return order;
    }
}