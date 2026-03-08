import { Request, Response } from 'express';
import Stripe from 'stripe';
import { Order } from '../models/order.model';
import { logger } from '../services/logger.service';
import { getIo } from '../utils/socket'; 
import { error } from 'console';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2026-02-25.clover', 
});

export const webhookController = {
    async handleStripeWebhook(req: Request, res: Response) {
        const sig = req.headers['stripe-signature'] as string;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

        let event: Stripe.Event;

        try {
           
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        } catch (err: any) {
            logger.error(`Webhook Signature Error: ${err.message}`, error);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            const orderId = session.client_reference_id;

            if (orderId) {
                try {
                    const order = await Order.findByIdAndUpdate(
                        orderId,
                        { paymentStatus: 'PAID' },
                        { new: true } 
                    );

                    if (order) {
                        logger.info(`Stripe Webhook: Order ${orderId} successfully updated to PAID`);

                        try {
                            const io = getIo();
                            io.to(order.userId.toString()).emit('orderStatusChanged', {
                                orderId: order._id,
                                paymentStatus: order.paymentStatus,
                                message: 'Payment successful! We are preparing your order.'
                            });
                        } catch (wsError) {
                            logger.error(`WebSocket Error on Webhook: ${wsError}`,error);
                        }
                    }
                } catch (dbError) {
                    logger.error(`Database Error updating order ${orderId} from webhook`, dbError);
                }
            }
        }

        res.status(200).send();
    }
};