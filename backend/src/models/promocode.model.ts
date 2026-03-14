import mongoose, { Schema, Document } from "mongoose";

export interface IPromoCode extends Document {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  users: mongoose.Types.ObjectId[];
  isGlobal: boolean;
  minOrderAmount: number;
  maxUsage: number;
  usedCount: number;
  expiresAt: Date;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const promoCodeSchema = new Schema<IPromoCode>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "fixed"], required: true },
    value: { type: Number, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isGlobal: { type: Boolean, default: true },
    minOrderAmount: { type: Number, default: 0 },
    maxUsage: { type: Number, required: true },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const PromoCode = mongoose.model<IPromoCode>("PromoCode", promoCodeSchema);
