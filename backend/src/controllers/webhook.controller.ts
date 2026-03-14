import { Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model";
import { logger } from "../services/logger.service";
import { error } from "console";
import mongoose from "mongoose";

import NotificationManager from '../utils/notification.manager';
import { NotificationResource } from '../enum/notification.enum';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

const notificationManager = new NotificationManager();

export const webhookController = {
  async handleStripeWebhook(req: Request, res: Response) {
    const sig = req.headers["stripe-signature"] as string;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err: any) {
      logger.error(`Webhook Signature Error: ${err.message}`, error);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.client_reference_id;

      if (orderId) {
        try {
          const order = await Order.findByIdAndUpdate(
            orderId,
            { paymentStatus: "PAID" },
            { new: true }
          );

          if (order) {
            logger.info(`Stripe Webhook: Order ${orderId} successfully updated to PAID`);
            
            if (order.promocode) {
              try {
                const promo = await mongoose
                  .model("PromoCode")
                  .findOneAndUpdate(
                    { code: order.promocode.toUpperCase() },
                    { $inc: { usedCount: 1 } }
                  );
                if (promo) {
                  logger.info(`Stripe Webhook: Incremented usage for promo code ${order.promocode}`);
                } else {
                  logger.error(`Stripe Webhook: Promo code ${order.promocode} not found in DB`, error);
                }
              } catch (promoError) {
                logger.error(`Stripe Webhook: Failed to increment usage for promo code ${order.promocode}. Error: ${promoError}`, error);
              }
            }
        
            try {
              await notificationManager.pushToUser(order.userId.toString(), {
                message: `Payment successful for order #${orderId.toString().slice(-4)}! We are preparing your food.`,
                resource: NotificationResource.ORDER,
                resourceId: orderId.toString()
              });
            } catch (notificationError) {
              logger.error(`Notification Error on Webhook: ${notificationError}`, error);
            }
            
          }
        } catch (dbError) {
          logger.error(`Database Error updating order ${orderId} from webhook`, dbError);
        }
      }
    }

    res.status(200).send();
  },
};