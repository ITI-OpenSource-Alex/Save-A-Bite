import { IsString, IsArray, IsNumber, ValidateNested, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    name!: string;

    // @IsString()
    // storeId!: string;

    @IsString()
    categoryId!: string;

    @IsArray()
    @IsString({ each: true })
    images!: string[];

    @IsNumber()
    price!: number;

    @IsNumber()
    stock!: number;

    @IsString()
    description!: string;
}

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsNumber()
    @IsOptional()
    price?: number;

    @IsNumber()
    @IsOptional()
    stock?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsString({ each: true })
    @IsOptional()
    images?: string[];
}
