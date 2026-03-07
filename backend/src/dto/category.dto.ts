import { IsOptional, IsMongoId, IsArray } from 'class-validator';

export class CategoryDto {
  name!: string;

  @IsOptional()
  categoryStock?: number;
}
