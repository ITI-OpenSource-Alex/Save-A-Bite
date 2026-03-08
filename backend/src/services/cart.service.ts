import { Cart, ICart } from "../models/cart.model";
import mongoose from "mongoose";
import { logger } from "./logger.service";
import { Product } from "../models/product.model";

export class CartService {
  constructor() {}

  private recalculateTotals(cart: ICart): void {
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cart.appliedPromoCode) {
      cart.discount = Math.round(cart.subtotal * 0.1 * 100) / 100;
    } else {
      cart.discount = 0;
    }

    cart.total = Math.round((cart.subtotal - cart.discount) * 100) / 100;
  }

  async getCart(userId: string): Promise<ICart> {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        items: [],
        subtotal: 0,
        discount: 0,
        total: 0,
      });

      await cart.save();
      logger.info(`New cart created for user id:${userId}`);
    }

    return cart;
  }

  async addItem(userId: string, itemData: { productId: string; quantity: number }): Promise<ICart> {
    if (itemData.quantity < 1) {
      throw new Error("Quantity must be greater than 0");
    }

    if (!mongoose.Types.ObjectId.isValid(itemData.productId)) {
      throw new Error("Invalid Product ID");
    }

    const cart = await this.getCart(userId);

    const product = await Product.findById(itemData.productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const existingQuantity = cart.items.find((item) => item.productId.toString() === itemData.productId)?.quantity || 0;
    if (existingQuantity + itemData.quantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock");
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === itemData.productId);

    if (existingItem) {
      existingItem.quantity += itemData.quantity;
      existingItem.price = product.price;

      logger.info(`Updated quantity for product ${itemData.productId} in cart of user id:${userId}`);
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(itemData.productId),
        quantity: itemData.quantity,
        price: product.price,
      });

      logger.info(`Added product ${itemData.productId} to cart of user id:${userId}`);
    }

    this.recalculateTotals(cart);

    await cart.save();

    return cart;
  }

  async updateItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await this.getCart(userId);

    const item = cart.items.find((item) => item.productId.toString() === productId);

    if (!item) {
      throw new Error("Product not found in cart");
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    } else {
      item.quantity = quantity;
    }

    this.recalculateTotals(cart);

    await cart.save();

    return cart;
  }

  async removeItem(userId: string, productId: string): Promise<ICart> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error("Invalid Product ID");
    }

    const cart = await this.getCart(userId);

    const itemIndex = cart.items.findIndex((item) => item.productId.toString() === productId);

    if (itemIndex === -1) {
      throw new Error("Product not found in cart");
    }

    cart.items.splice(itemIndex, 1);

    this.recalculateTotals(cart);

    await cart.save();

    logger.info(`Removed product ${productId} from cart of user id:${userId}`);

    return cart;
  }

  async clearCart(userId: string): Promise<ICart> {
    const cart = await this.getCart(userId);

    cart.items = [];
    cart.subtotal = 0;
    cart.discount = 0;
    cart.total = 0;
    cart.appliedPromoCode = undefined;

    await cart.save();

    logger.info(`Cart cleared for user id:${userId}`);

    return cart;
  }

  async applyPromoCode(userId: string, promoCode: string): Promise<ICart> {
    const cart = await this.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error("Cannot apply promo code to an empty cart");
    }

    cart.appliedPromoCode = promoCode;

    this.recalculateTotals(cart);

    await cart.save();

    logger.info(`Promo code "${promoCode}" applied to cart of user id:${userId}`);

    return cart;
  }

  async removePromoCode(userId: string): Promise<ICart> {
    const cart = await this.getCart(userId);

    cart.appliedPromoCode = undefined;

    this.recalculateTotals(cart);

    await cart.save();

    logger.info(`Promo code removed from cart of user id:${userId}`);

    return cart;
  }
}
