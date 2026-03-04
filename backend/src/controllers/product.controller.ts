import { Response as ExpressResponse, NextFunction } from "express";
import { ObjectId } from "mongodb";
import { ProductService } from "../services/product.service";
import { logger } from "../services/logger.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CreateProductDto, UpdateProductDto } from "../dto/product.dto";

export class ProductController{
    constructor(private productService: ProductService){}

    createProduct = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
        try {
            const userId = req.jwt?.userId;
            const storeId = req.jwt?.storeId; // TODO: NEED TO BE UPDATED AFTER IMPLEMENTING RBAC
            const productData: CreateProductDto = req.body;
            
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            
            const product = await this.productService.createProduct({
                ...productData,
                categoryId: new ObjectId(productData.categoryId),
                productId: new ObjectId, 
                isActive: true,
                isDeleted: false,
                createdAt: new Date(),
                updatedAt: new Date(),
                storeId: new ObjectId(storeId),
            });

            const status = product.createdAt === product.updatedAt ? 201 : 200;
            const message = status === 201 ? "Product created successfully" : "Product already processed";
            
            return res.status(status).json({ message, product });
        }
        catch (error: any) {
            logger.error(`Internal server error`, error);
            return res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }

    getProducts = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) =>{
        try {
            const filters = req.query;
            const products = await this.productService.getAllProducts(filters);
            return res.status(200).json({ products });
        }catch(error: any){
            logger.error(`Internal server error`, error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    getProductById = async(req: AuthRequest, res: ExpressResponse, next: NextFunction) =>{
        try {
            const productId = req.params.id as string
            const product = await this.productService.getProductById(productId);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ product });
        }catch(error: any){
            logger.error(`Internal server error`, error);
            return res.status(500).json({ message: error.message });
        }
    }

    updateProduct = async(req: AuthRequest, res: ExpressResponse, next: NextFunction)=>{
        try{
            const productId = req.params.id as string;
            const updateData: UpdateProductDto = req.body;
            const updatedProduct = await this.productService.updateProductById(productId, updateData);
            if (!updatedProduct){
                logger.warning(`Product not found: ${productId}`)
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
        } catch(error:any){
            logger.error("Internal server error", error);
            return res.status(500).json({ message: error.message })
        }
    }

    deleteProduct = async(req: AuthRequest, res: ExpressResponse, next: NextFunction)=>{
        try{
            const productId = req.params.id as string;
            const deletedProduct = await this.productService.deleteProductById(productId);
            if (!deletedProduct){
                logger.warning(`Product not found: ${productId}`)
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
        } catch(error:any){
            logger.error("Internal server error", error);
            return res.status(500).json({ message: error.message })
        }
    }

}
export const productController = new ProductController(new ProductService());