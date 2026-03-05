import mongoose, { Schema, Document, mongo, model } from "mongoose";
import { IProduct } from "./product.model";
import {ECategory } from "../enum/category.enum";

export interface ICategory extends Document {
  name: ECategory;
  categoryStock:IProduct[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, enum: Object.values(ECategory), required: true, trim: true },
    categoryStock:  
      [
        {
         type: String,
         ref:"Product" 
        }
      ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", CategorySchema);
