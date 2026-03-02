import {Response, Request} from "express";
import mongoose from "mongoose";
import {Order} from "../models/order.model";
import {logger} from "../services/logger.service";
import { log } from "console";

export interface AuthRequest extends Request { // Todo: replace with proper user idenitifaction 
  user?: { 
    id: string;
  }; 
}

export const orderController = {
    createOrder: async (req: AuthRequest, res: Response) =>{
        try{
            const idempotencyKey = req.headers["idempotency-key"] as string
            const userId = req.user?.id
            // todo: Auth check

            if (!idempotencyKey) {
                logger.error(`Idempotency key is missing`, null)
                return res.status(400).json({ message: "idempotency-key header is required" })
            }

            if (!req.body.items || req.body.items.length === 0) {
                logger.error(`Order items are missing`, null)
                return res.status(400).json({ message: "Order items are required" })
            }
             
            const existingOrder = await Order.findOne({idempotencyKey, userId})
            if (existingOrder){
                logger.info(`Order with idempotency key ${idempotencyKey} already exists`)
                return res.status(200).json({message: "Order already processed", order: existingOrder});
            }

            const newOrder = new Order({
                ...req.body,
                userId,
                idempotencyKey,
                status: 'PLACED',
                paymentStatus: 'PENDING'
            })
            await newOrder.save()
            logger.info(`Order created successfully of user id:${newOrder.userId}`)
            return res.status(201).json({message: "Order created successfully", order: newOrder});
        }catch(error: any){
            if (error.name === 'ValidationError') {
                logger.error(`Validation Error`, error)
                 return res.status(400).json({ message: "Validation Error", details: error.message });
            }
            if (error.code === 11000){ // Catch duplicate idempotency key race condition
                const retryOrder = await Order.findOne({idempotencyKey: req.headers["idempotency-key"]})
                logger.info(`Order with idempotency key ${req.headers["idempotency-key"]} already exists`)

                return res.status(200).json({message: "Order already processed", order: retryOrder})

            }
            logger.error(`Internal server error`, error)
            return res.status(500).json({ message: "Internal server error", error: error.message });

        }
        
    },


    getMyOrders: async(req: AuthRequest, res:Response)=>{
        try{
            const userId = req.user?.id
            const orders = await Order.find({userId}).sort({createdAt: -1})
            logger.info(`Orders fetched successfully of user id:${userId}`)
            return res.status(200).json({orders})
        }
        catch(error:any){
            logger.error(`Internal server error`, error)
            return res.status(500).json({ message: "Internal server error"});
        }
    },

    getOrderById: async (req: AuthRequest, res: Response)=>{
        try{
            const orderId = req.params.id as string
            const userId = req.user?.id

            if (!mongoose.Types.ObjectId.isValid(orderId)){
                logger.error(`Invalid Order ID`, null)
                return res.status(400).json({message: "Invalid Order ID"})
            }

            const order = await Order.findOne({ _id: orderId, userId });
            if (!order) {
                logger.error(`Order not found`, null)
                return res.status(404).json({ message: "Order not found" });
            }

            return res.status(200).json({ order });

        }
        catch(error:any){
            logger.error(`Internal server error`, error)
            return res.status(500).json({ message: "Internal server error"});
        }
    },

    cancelOrder: async(req: AuthRequest, res:Response)=>{
        try{
            const orderId = req.params.id as string
            const userId = req.user?.id

            if (!mongoose.Types.ObjectId.isValid(orderId)) {
                logger.error(`Invalid Order ID`, null)
                return res.status(400).json({ message: "Invalid Order ID" });
            }
            const order = await Order.findOne({ _id: orderId, userId });

            if (!order){
                logger.error(`Order not found`, null)
                return res.status(404).json({ message: "Order not found" });            
            }

            if (order.status !== 'PLACED' && order.status !== 'PROCESSING') {
                logger.error(`Cannot cancel an order with status: ${order.status}`, null)
                return res.status(400).json({ message: `Cannot cancel an order with status: ${order.status}` });
            }

            order.status = 'CANCELLED';
            await order.save();

            logger.info(`Order cancelled successfully of user id:${userId}`)
            return res.status(200).json({ message: "Order cancelled successfully" });
            
        }
        catch(error: any){
            return res.status(500).json({ message: "Internal server error"});
        }
    },
    
    
}