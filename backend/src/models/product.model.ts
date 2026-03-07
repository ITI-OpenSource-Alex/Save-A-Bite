import mongoose, { Schema } from "mongoose";

export interface IProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  storeId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.index({ categoryId: 1, storeId: 1, price: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
