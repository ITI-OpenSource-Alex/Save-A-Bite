import mongoose, { Schema, Document, Types } from "mongoose";

export enum VendorRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

export interface IVendorRequest extends Document {
  userId: Types.ObjectId;
  storeName: string;
  storeDescription: string;
  storePhone: string;
  storeEmail: string;
  storeLogoUrl?: string;
  message?: string;
  status: VendorRequestStatus;
  reviewedBy?: Types.ObjectId;
  reviewedAt?: Date;
  rejectionReason?: string;
  isNewUser: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VendorRequestSchema = new Schema<IVendorRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storeName: { type: String, required: true, trim: true },
    storeDescription: { type: String, required: true, trim: true },
    storePhone: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{8,11}$/, "Invalid phone number"],
    },
    storeEmail: { type: String, required: true, trim: true },
    storeLogoUrl: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: Object.values(VendorRequestStatus),
      default: VendorRequestStatus.PENDING,
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
    rejectionReason: { type: String, trim: true },
    isNewUser: { type: Boolean, default: false },
  },
  { timestamps: true }
);

VendorRequestSchema.index({ userId: 1, status: 1 });
VendorRequestSchema.index({ status: 1 });

export const VendorRequest = mongoose.model<IVendorRequest>("VendorRequest", VendorRequestSchema);
