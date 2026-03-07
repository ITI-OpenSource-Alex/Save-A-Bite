import { IsString, IsArray, IsNumber, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  price!: number;
}

export class CreateOrderDto {
  @IsString()
  storeId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsNumber()
  totalPrice!: number;

  @IsNumber()
  discount!: number;

  @IsNumber()
  finalPrice!: number;

  @IsEnum(['CASH', 'CARD', 'WALLET'])
  @IsString()
  paymentMethod!: 'CASH' | 'CARD' | 'WALLET';

  @IsString()
  addressSnapshot!: string;

  @IsString()
  promocode?: string;
}
