import { ObjectId } from "mongodb";
import { Role } from "../enum/role.enum";

export class JwtDto {
  userId!: string;
  role!: Role;
  storeId?: ObjectId;
  email!: string;
  iat?: number;
  exp?: number;
}
