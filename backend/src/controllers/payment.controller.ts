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
      const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

const lineItems = order.items.map((item: any) => {
          const itemTotal = item.price * item.quantity;
  const itemShare = itemTotal / subtotal;
  const itemDiscount = (order.discount || 0) * itemShare;
         
         const discountedUnitPrice = item.price - (itemDiscount / item.quantity);
      return {
    price_data: {
      currency: "egp",
      product_data: {
        name: item.productId?.name || "LastBite Item",
      },
      unit_amount: Math.max(0, Math.round(discountedUnitPrice * 100)),
    },
    quantity: item.quantity,
  };
});

      
const deliveryFee = 15; 
lineItems.push({
  price_data: {
    currency: "egp",
    product_data: { name: "Delivery Fee" },
    unit_amount: Math.round(deliveryFee * 100),
  },
  quantity: 1,
});
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: lineItems,
        success_url: `http://localhost:4200/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `http://localhost:4200/checkout/cancel`,
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