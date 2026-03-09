import { Schema, Document, model, Types } from "mongoose";
import { IAddress } from "./address.model";

export interface IStore extends Document {
  name: string;
  description: string;
  ownerId: Types.ObjectId;
  phone: string;
  email: string;
  address: IAddress;
  logoUrl: string;
  isActive: boolean;
  isDeleted: boolean;
  avgRating: number;
  countRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  phone: {
    type: String,
    trim: true,
    match: [/^\d{8,11}$/, "Invalid phone number"],
  },
  email: { type: String, trim: true },
  address: {
    type: Schema.Types.ObjectId,
    ref: "Address",
  },
  logoUrl: { type: String, trim: true },
  isActive: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0 },
  countRatings: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false },
});

export default model<IStore>("Store", StoreSchema);
