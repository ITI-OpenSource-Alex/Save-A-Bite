import { Order } from "../models/order.model";
import { Product } from "../models/product.model";
import NotificationCollector from "./notification.collector";
import { NotificationResource } from "../enum/notification.enum";

export async function pushOrderNotification(userId: string, orderId: string) {
  try {
    const order = await Order.findById(orderId);
    if (!order) return;

    await NotificationCollector.getInstance().collect({
      userId,
      message: `Your order #${orderId.substring(orderId.length - 6)} is now ${order.status}`,
      resource: NotificationResource.ORDER,
      resourceId: orderId,
    });
  } catch (error) {
    console.error('Error in pushOrderNotification:', error);
  }
}

export async function pushPromoCodeNotification(userId: string, promoCode: string) {
  try {
    await NotificationCollector.getInstance().collect({
      userId,
      message: `New promo code available: ${promoCode}! Use it now for a discount.`,
      resource: NotificationResource.PROMOCODE,
      resourceId: promoCode,
    });
  } catch (error) {
    console.error('Error in pushPromoCodeNotification:', error);
  }
}

export async function pushFlashDealNotification(userId: string, productId: string) {
  try {
    const product = await Product.findById(productId);
    if (!product) return;

    await NotificationCollector.getInstance().collect({
      userId,
      message: `Flash Deal! ${product.name} is now on sale!`,
      resource: NotificationResource.FLASHSALE,
      resourceId: productId,
    });
  } catch (error) {
    console.error('Error in pushFlashDealNotification:', error);
  }
}