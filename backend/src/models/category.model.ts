import { Schema, Document, model, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  categoryStock: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  icon?: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    categoryStock: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    icon: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Category = model<ICategory>("Category", CategorySchema);
