//import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { Role } from "../enum/role.enum";

export class JwtDto {
  userId!: string;
  role!: Role;
  storeId?: mongoose.Types.ObjectId;
  email!: string;
  iat?: number;
  exp?: number;
}
