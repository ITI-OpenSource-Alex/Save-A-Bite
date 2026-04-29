import { IsString, IsOptional, IsEnum, IsNotEmpty, IsEmail, MinLength } from "class-validator";
import { VendorRequestStatus } from "../models/vendorRequest.model";

export class CreateVendorRequestDto {
  @IsString()
  @IsNotEmpty()
  storeName!: string;

  @IsString()
  @IsNotEmpty()
  storeDescription!: string;

  @IsString()
  @IsNotEmpty()
  storePhone!: string;

  @IsEmail({}, { message: "Store email must be a valid email address" })
  @IsNotEmpty()
  storeEmail!: string;

  @IsString()
  @IsOptional()
  storeLogoUrl?: string;

  @IsString()
  @IsOptional()
  message?: string;

  // Guest registration details (Optional if logged in)
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Account email must be a valid email address" })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: "Password must be at least 6 characters long" })
  password?: string;
}

export class ReviewVendorRequestDto {
  @IsEnum(VendorRequestStatus)
  status!: VendorRequestStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;
}
