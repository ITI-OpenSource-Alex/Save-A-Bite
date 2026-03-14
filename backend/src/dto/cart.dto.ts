import { IsString, IsNumber, IsOptional } from 'class-validator';

export class AddItemDto {
    @IsString()
    productId!: string;

    @IsNumber()
    quantity!: number;
}

export class UpdateItemDto {
    @IsString()
    productId!: string;

    @IsNumber()
    quantity!: number;
}

export class ApplyPromoCodeDto {
    @IsString()
    promoCode!: string;
}
