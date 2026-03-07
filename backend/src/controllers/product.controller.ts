import { Response as ExpressResponse, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { ProductService } from "../services/product.service";
import { logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";
import { CategoryService } from "../services/category.service";
import mongoose from "mongoose";

export class ProductController {
  constructor(private productService: ProductService) {}

  categoryService = new CategoryService();

  createProduct = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt?.userId;
      const storeId = Array.isArray(req.params.storeId)
        ? req.params.storeId[0]
        : (req.params.storeId as string);

      if (!userId || !mongoose.Types.ObjectId.isValid(storeId)) {
        return res.status(400).json({ message: "Invalid user or storeId" });
      }

      const productData: CreateProductDto = req.body;

      const product = await this.productService.createProduct({
        ...productData,
        categoryId: new ObjectId(productData.categoryId),
        productId: new ObjectId(),
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        storeId: new ObjectId(storeId),
      });

      const category = await this.categoryService.incrementStock(product.categoryId.toString(), 1);

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(201).json({
        message: "Product created successfully",
        product,
      });
    } catch (error: any) {
      logger.error(`Error creating product: ${error.message}`, error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

  getProducts = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const filters = req.query;
      const products = await this.productService.getAllProducts(filters);
      return res.status(200).json({ products });
    } catch (error: any) {
      logger.error(`Internal server error`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  };

  getProductById = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const product = await this.productService.getProductById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ product });
    } catch (error: any) {
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: error.message });
    }
  };

  getProductByIdAndStoreId = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const storeId = req.params.storeId as string;
      const product = await this.productService.getProductByIdAndStoreId(productId, storeId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({ product });
    } catch (error: any) {
      logger.error(`Internal server error`, error);
      return res.status(500).json({ message: error.message });
    }
  };

  updateProduct = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const updateData: UpdateProductDto = req.body;
      const updatedProduct = await this.productService.updateProductById(productId, updateData);
      if (!updatedProduct) {
        logger.warning(`Product not found: ${productId}`);
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error: any) {
      logger.error("Internal server error", error);
      return res.status(500).json({ message: error.message });
    }
  };

  deleteProduct = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const productId = req.params.id as string;
      const deletedProduct = await this.productService.deleteProductById(productId);
      if (!deletedProduct) {
        logger.warning(`Product not found: ${productId}`);
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json({
        message: "Product deleted successfully",
        product: deletedProduct,
      });
    } catch (error: any) {
      logger.error("Internal server error", error);
      return res.status(500).json({ message: error.message });
    }
  };
}

export const productController = new ProductController(new ProductService());
