import { Response as ExpressResponse, NextFunction } from "express";
import { PromoCodeService } from "../services/promocode.service";
import { logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class PromoCodeController {
  private promoCodeService: PromoCodeService;

  constructor() {
    this.promoCodeService = new PromoCodeService();
  }

  createGlobalPromo = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const { code, type, value, minOrderAmount, maxUsage, expiresAt } = req.body;

      const promo = await this.promoCodeService.createPromoCode({
        code,
        type,
        value,
        minOrderAmount,
        maxUsage,
        expiresAt,
      });

      return res.status(201).json({
        message: "Global promo code created",
        promo,
      });
    } catch (error: any) {
      if (error.message === "Promo code already exists") {
        return res.status(409).json({ message: error.message });
      }

      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  createUserPromo = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.params.userId as string;
      const { code, type, value, minOrderAmount, maxUsage, expiresAt } = req.body;

      const promo = await this.promoCodeService.createPromoCode(
        { code, type, value, minOrderAmount, maxUsage, expiresAt },
        userId,
      );

      return res.status(201).json({
        message: "User-specific promo code created",
        promo,
      });
    } catch (error: any) {
      if (error.message === "Promo code already exists") {
        return res.status(409).json({ message: error.message });
      }

      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  updatePromo = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const promo = await this.promoCodeService.updatePromoCode(id, req.body);

      return res.status(200).json({
        message: "Promo code updated",
        promo,
      });
    } catch (error: any) {
      if (error.message === "Invalid promo code ID") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Promo code not found") {
        return res.status(404).json({ message: error.message });
      }

      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  deactivatePromo = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const promo = await this.promoCodeService.deactivatePromoCode(id);

      return res.status(200).json({
        message: "Promo code deactivated",
        promo,
      });
    } catch (error: any) {
      if (error.message === "Invalid promo code ID") {
        return res.status(400).json({ message: error.message });
      }
      if (error.message === "Promo code not found") {
        return res.status(404).json({ message: error.message });
      }

      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export const promoCodeController = new PromoCodeController();
