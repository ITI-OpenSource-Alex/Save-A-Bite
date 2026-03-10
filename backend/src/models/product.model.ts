import mongoose, { Schema } from "mongoose";

export interface IProduct {
  name: string;
  storeId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  images: string[];
  price: number;
  stock: number;
  description: string;
  isActive: boolean;
  isDeleted: boolean;
  isFlashDeal?: boolean;
  discountPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    isFlashDeal: { type: Boolean, default: false },
    discountPercentage: {
      type: Number,
      default: 30,
      min: [0, "Discount cannot be less than 0"],
      max: [100, "Discount cannot exceed 100"],
    },
  },
  { timestamps: true }
);
productSchema.index({ isFlashDeal: 1, isDeleted: 1, isActive: 1 })
productSchema.index({ categoryId: 1, storeId: 1, price: 1 });

export const Product = mongoose.model<IProduct>("Product", productSchema);
