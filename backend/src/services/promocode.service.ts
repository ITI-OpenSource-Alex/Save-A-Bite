import { PromoCode, IPromoCode } from "../models/promocode.model";
import mongoose from "mongoose";
import { logger } from "./logger.service";

import NotificationManager from '../utils/notification.manager';
import { NotificationResource } from '../enum/notification.enum';

const notificationManager = new NotificationManager();


export class PromoCodeService {
  constructor() {}

  async createPromoCode(
    data: {
      code: string;
      type: "percentage" | "fixed";
      value: number;
      minOrderAmount?: number;
      maxUsage: number;
      expiresAt: string;
    },
    userId?: string,
  ): Promise<IPromoCode> {
    const existing = await PromoCode.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      throw new Error("Promo code already exists");
    }

    const promoCode = new PromoCode({
      code: data.code,
      type: data.type,
      value: data.value,
      minOrderAmount: data.minOrderAmount || 0,
      maxUsage: data.maxUsage,
      expiresAt: new Date(data.expiresAt),
      isGlobal: !userId,
      users: userId ? [new mongoose.Types.ObjectId(userId)] : [],
    });

    await promoCode.save();

    logger.info(`Promo code "${promoCode.code}" created (${userId ? `for user ${userId}` : "global"})`);

      try {
      const discountText = data.type === 'percentage' ? `${data.value}% off` : `${data.value} EGP off`;
      if (userId) {
        await notificationManager.pushToUser(userId.toString(), {
          message: `A new promo code "${promoCode.code}" has been created for you: ${discountText}! Use it before ${promoCode.expiresAt.toDateString()}.`,
          resource: NotificationResource.PROMOCODE,
          resourceId: promoCode._id.toString()
        });
      }
      else {
        await notificationManager.pushBroadcastNotification({
          message: `🔥 Flash Deal! Use code ${promoCode.code} for ${discountText} your next order!`,
          resource: NotificationResource.PROMOCODE,
          resourceId: promoCode._id.toString()
        });
      }
    } catch (error) {
      logger.error(`Notification Error: Failed to send notification for promo code ${promoCode._id}`, error);
    }
    return promoCode;
  }

  async updatePromoCode(
    id: string,
    data: Partial<{
      code: string;
      type: "percentage" | "fixed";
      value: number;
      minOrderAmount: number;
      maxUsage: number;
      expiresAt: string;
      active: boolean;
    }>,
  ): Promise<IPromoCode> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid promo code ID");
    }

    const updateData: any = { ...data };
    if (data.expiresAt) {
      updateData.expiresAt = new Date(data.expiresAt);
    }

    const promoCode = await PromoCode.findByIdAndUpdate(id, updateData, { new: true });

    if (!promoCode) {
      throw new Error("Promo code not found");
    }

    logger.info(`Promo code "${promoCode.code}" updated`);

    return promoCode;
  }

  async deactivatePromoCode(id: string): Promise<IPromoCode> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid promo code ID");
    }

    const promoCode = await PromoCode.findByIdAndUpdate(id, { active: false }, { new: true });

    if (!promoCode) {
      throw new Error("Promo code not found");
    }

    logger.info(`Promo code "${promoCode.code}" deactivated`);

    return promoCode;
  }

  async validateAndGetPromo(code: string, userId: string, subtotal: number): Promise<IPromoCode> {
    const promo = await PromoCode.findOne({ code: code.toUpperCase() });

    if (!promo) {
      throw new Error("Promo code not found");
    }

    if (!promo.active) {
      throw new Error("Promo code is no longer active");
    }

    if (promo.expiresAt < new Date()) {
      throw new Error("Promo code has expired");
    }

    if (promo.usedCount >= promo.maxUsage) {
      throw new Error("Promo code usage limit reached");
    }

    if (!promo.isGlobal) {
      const isAllowed = promo.users.some((u) => u.toString() === userId);
      if (!isAllowed) {
        throw new Error("You are not allowed to use this promo code");
      }
    }

    if (subtotal < promo.minOrderAmount) {
      throw new Error(`Minimum order amount of ${promo.minOrderAmount} not met`);
    }

    return promo;
  }

  async incrementUsage(promoId: mongoose.Types.ObjectId): Promise<void> {
    await PromoCode.findByIdAndUpdate(promoId, { $inc: { usedCount: 1 } });
  }
}
