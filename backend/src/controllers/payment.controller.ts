import { Request, Response } from "express";
import Stripe from "stripe";
import { Order } from "../models/order.model";
import { logger } from "../services/logger.service";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-02-25.clover",
});

export const paymentController = {
  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { orderId } = req.body;
      const order = await Order.findById(orderId).populate("items.productId");

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const lineItems = order.items.map((item: any) => {
        return {
          price_data: {
            currency: "egp",
            product_data: {
              name: item.productId?.name || "Save-A-Bite Item",
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        };
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `http://localhost:4200/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:4200/checkout/cancel`,
        // Attach the Order ID so we can verify it later
        client_reference_id: orderId.toString(),
      });

      logger.info(`Stripe checkout session created for order: ${orderId}`);

      res.status(200).json({ url: session.url });
    } catch (error: any) {
      logger.error("Stripe Session Error:", error);
      res.status(500).json({ message: "Failed to create payment session" });
    }
  },
};