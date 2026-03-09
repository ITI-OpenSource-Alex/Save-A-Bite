import mongoose, {Schema,Document, mongo} from "mongoose";
import { PAYMENT_METHOD, PAYMENT_STATUS, ORDER_STATUS} from "../enum/order.enum";


export interface IOrderItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  storeId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  discount: number;
  finalPrice: number;
  paymentMethod: "CASH" | "CARD" | "WALLET";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
  status: "PLACED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  addressSnapshot: Record<string, string>;
  promocode?: string;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    storeId: { type: Schema.Types.ObjectId, ref: "Store", required: true },
    items: { type: [orderItemSchema], required: true },
    totalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["CASH", "CARD", "WALLET"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },
    status: {
      type: String,
      enum: ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },
    addressSnapshot: { type: String, required: true },
    promocode: { type: String },
    idempotencyKey: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1 });

export const Order = mongoose.model<IOrder>("Order", orderSchema);
