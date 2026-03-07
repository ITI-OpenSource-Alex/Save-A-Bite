import { Product, IProduct } from "../models/product.model";
import mongoose from "mongoose";
import { logger } from "./logger.service";

export class ProductService {
  constructor() {}

  async createProduct(productData: IProduct): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    logger.info(
      `Product created successfully of store id:${newProduct.storeId}`,
    );
    return newProduct;
  }

  async getAllProducts(filters: any): Promise<IProduct[]> {
    const query: any = { isDeleted: false, isActive: true };
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.storeId) query.storeId = filters.storeId;
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }
    logger.info(`Products fetched successfully`);
    return await Product.find(query).populate("storeId categoryId");
  }

  async getProductByIdAndStoreId(
    productId: string,
    storeId: string,
  ): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warning(`Invalid Product ID: ${productId}`);
      throw new Error("Invalid Product ID");
    }
    const product = await Product.findOne({
      _id: productId,
      storeId,
      isDeleted: false,
      isActive: true,
    });
    if (!product) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return product;
  }

  async getProductById(productId: string): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warning(`Invalid Product ID: ${productId}`);
      throw new Error("Invalid Product ID");
    }
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
      isActive: true,
    });
    if (!product) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return product;
  }

  async updateProductById(
    productId: string,
    updateData: Partial<IProduct>,
  ): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warning(`Invalid Product ID: ${productId}`);
      throw new Error("Invalid Product ID");
    }
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updateData,
      { new: true },
    );
    if (!updatedProduct) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return updatedProduct;
  }

  async deleteProductById(productId: string): Promise<IProduct | null> {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      logger.warning(`Invalid Product ID: ${productId}`);
      throw new Error("Invalid Product ID");
    }
    const deletedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true },
    );
    if (!deletedProduct) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return deletedProduct;
  }
}
