import { ObjectId } from "mongodb";

export class JwtDto {
    userId!: string;
    role!: string;
    storeId?: ObjectId;
    email!: string;
    iat?: number;
    exp?: number;
}
