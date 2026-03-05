import mongoose, { Schema, Document } from "mongoose";

export interface IAddress extends Document {
  user: mongoose.Types.ObjectId;
  alias: string;
  street: string;
  city: string;
  postalCode?: string;
}
const addressSchema = new Schema<IAddress>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },
    alias: { type: String, required: [true, "Alias is required"], trim: true },
    street: {
      type: String,
      required: [true, "Street is required"],
      trim: true,
    },
    city: { type: String, required: [true, "City is required"], trim: true },
    postalCode: { type: String, trim: true },
  },
  { timestamps: true },
);
export default mongoose.model<IAddress>("Address", addressSchema);
