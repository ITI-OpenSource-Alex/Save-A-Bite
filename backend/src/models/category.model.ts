import mongoose, { Schema, Document, mongo, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Category = model<ICategory>("Category", CategorySchema);
