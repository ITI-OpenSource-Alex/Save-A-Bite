import { Product, IProduct } from "../models/product.model";
import mongoose from "mongoose";
import { logger } from "./logger.service";
import { AbacRequest } from "../middlewares/abac.middleware";

export class ProductService {
  constructor() {}

  async createProduct(productData: IProduct): Promise<IProduct> {
    const newProduct = new Product(productData);
    await newProduct.save();
    logger.info(`Product created successfully of store id:${newProduct.storeId}`);
    return newProduct;
  }

  async getAllProducts(
    filters: any
  ): Promise<{ products: IProduct[]; total: number; page: number; limit: number }> {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const sort = filters.sort || "relevance";

    const query: any = { isDeleted: false, isActive: true };
    if (filters.category) query.categoryId = filters.category;
    if (filters.categoryId) query.categoryId = filters.categoryId;
    if (filters.storeId) query.storeId = filters.storeId;

    if (filters.isFlashDeal === true || filters.isFlashDeal === "true") {
      query.isFlashDeal = true;
    }

    if (filters.minPrice != null || filters.maxPrice != null) {
      query.price = {};
      if (filters.minPrice != null) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice != null) query.price.$lte = Number(filters.maxPrice);
    }

    if (filters.search) {
      const searchRegex = { $regex: filters.search, $options: "i" };
      query.$or = [{ name: searchRegex }, { description: searchRegex }];
    }

    let sortOption: any = { createdAt: -1 }; // Default to newest
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const skip = (page - 1) * limit;

    const [products, totalItems] = await Promise.all([
      Product.find(query)
        .populate("storeId categoryId")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .exec(),
      Product.countDocuments(query),
    ]);
    logger.info(`Products fetched successfully`);
    return { products, total: totalItems, page, limit };
  }

  async getProductByIdAndStoreId(productId: string, storeId: string): Promise<IProduct | null> {
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
    const product = await Product.findOne({
      _id: productId,
      isDeleted: false,
    })
      .populate({ path: "storeId", select: "ownerId" })
      .exec();
    if (!product) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return product;
  }

  async updateProductById(
    productId: string,
    updateData: Partial<IProduct>
  ): Promise<IProduct | null> {
    const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
    if (!updatedProduct) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return updatedProduct;
  }

  async deleteProductById(productId: string): Promise<IProduct | null> {
    const deletedProduct = await Product.findByIdAndUpdate(
      productId,
      { isDeleted: true },
      { new: true }
    );
    if (!deletedProduct) {
      logger.warning(`Product not found: ${productId}`);
      return null;
    }
    return deletedProduct;
  }
}


