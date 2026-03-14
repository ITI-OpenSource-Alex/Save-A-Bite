import { IsString, IsNumber, IsEnum, IsBoolean, IsDateString, IsOptional, Min } from "class-validator";

export class CreatePromoCodeDto {
  @IsString()
  code!: string;

  @IsEnum(["percentage", "fixed"])
  type!: "percentage" | "fixed";

  @IsNumber()
  @Min(0)
  value!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @IsNumber()
  @Min(1)
  maxUsage!: number;

  @IsDateString()
  expiresAt!: string;
}

export class UpdatePromoCodeDto {
  @IsString()
  @IsOptional()
  code?: string;

  @IsEnum(["percentage", "fixed"])
  @IsOptional()
  type?: "percentage" | "fixed";

  @IsNumber()
  @Min(0)
  @IsOptional()
  value?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  minOrderAmount?: number;

  @IsNumber()
  @Min(1)
  @IsOptional()
  maxUsage?: number;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsBoolean()
  @IsOptional()
  active?: boolean;
}
