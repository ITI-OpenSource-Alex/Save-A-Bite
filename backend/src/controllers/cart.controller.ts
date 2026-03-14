import { Response as ExpressResponse, NextFunction } from "express";
import { CartService } from "../services/cart.service";
import { logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  getCart = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const cart = await this.cartService.getCart(userId);
      await cart.populate("items.productId");

      return res.status(200).json({ cart });
    } catch (error) {
      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  addItem = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const { productId, quantity } = req.body;

      const cart = await this.cartService.addItem(userId, { productId, quantity });
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Item added to cart",
        cart,
      });
    } catch (error: any) {
      if (
        error.message === "Quantity must be greater than 0" ||
        error.message === "Invalid Product ID" ||
        error.message === "Requested quantity exceeds available stock"
      ) {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "Product not found") {
        return res.status(404).json({ message: error.message });
      }

      logger.error("Internal server error", error);
      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  updateItem = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const { productId, quantity } = req.body;

      const cart = await this.cartService.updateItem(userId, productId, quantity);
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Cart item updated",
        cart,
      });
    } catch (error: any) {
      if (error.message === "Product not found in cart") {
        return res.status(404).json({ message: error.message });
      }

      logger.error("Internal server error", error);

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  removeItem = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const productId = req.params.productId as string;

      const cart = await this.cartService.removeItem(userId, productId);
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Item removed from cart",
        cart,
      });
    } catch (error: any) {
      if (error.message === "Invalid Product ID" || error.message === "Product not found in cart") {
        return res.status(400).json({ message: error.message });
      }

      logger.error("Internal server error", error);

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  clearCart = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;

      const cart = await this.cartService.clearCart(userId);
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Cart cleared",
        cart,
      });
    } catch (error) {
      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  applyPromoCode = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const { promoCode } = req.body;

      const cart = await this.cartService.applyPromoCode(userId, promoCode);
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Promo code applied",
        cart,
      });
    } catch (error: any) {
      const badRequestErrors = [
        "Cannot apply promo code to an empty cart",
        "Promo code is no longer active",
        "Promo code has expired",
        "Promo code usage limit reached",
        "You are not allowed to use this promo code",
      ];

      if (
        badRequestErrors.includes(error.message) ||
        error.message.startsWith("Minimum order amount")
      ) {
        return res.status(400).json({ message: error.message });
      }

      if (error.message === "Promo code not found") {
        return res.status(404).json({ message: error.message });
      }

      logger.error("Internal server error", error);

      return res.status(500).json({
        message: "Internal server error",
        error: error.message,
      });
    }
  };

  removePromoCode = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;

      const cart = await this.cartService.removePromoCode(userId);
      await cart.populate("items.productId");

      return res.status(200).json({
        message: "Promo code removed",
        cart,
      });
    } catch (error) {
      logger.error("Internal server error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
}

export const cartController = new CartController();
