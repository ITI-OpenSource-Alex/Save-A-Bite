import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import { Role } from "../enum/role.enum";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: Role;
  profileImage?: string;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  address?: mongoose.Types.ObjectId;
  tokenBlacklist?: string[];
  // Email verification
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
  // OTP (forget password / change email)
  otpCode?: string;
  otpExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be at least 8 characters"],
      required: false,
    },
    phone: { type: String, trim: true },
    role: { type: String, enum: Object.values(Role), default: Role.USER },
    profileImage: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    address: { type: Schema.Types.ObjectId, ref: "Address" },
    tokenBlacklist: [{ type: String }],
    // Email verification
    verificationToken: { type: String },
    verificationTokenExpiresAt: { type: Date },
    // OTP
    otpCode: { type: String },
    otpExpiresAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
