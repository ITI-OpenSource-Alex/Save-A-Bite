import { IsOptional, IsMongoId, IsArray } from 'class-validator';

export class StoreDto {
  name!: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  phone?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  address?: string;
  @IsOptional()
  logoUrl?: string;
  @IsOptional()
  avgRating?: number;
}

export class UpdateStoreDto {
  @IsOptional()
  name?: string;
  @IsOptional()
  description?: string;
  @IsOptional()
  phone?: string;
  @IsOptional()
  email?: string;
  @IsOptional()
  address?: string;
  @IsOptional()
  logoUrl?: string;
  @IsOptional()
  avgRating?: number;
}
