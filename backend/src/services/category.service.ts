import { Service } from "typedi";
import { ICategory, Category } from "../models/category.model";
import { ObjectId } from "mongoose";
import { Types } from "mongoose";

@Service()
export class CategoryService {
  async createCategory(data: Partial<ICategory>) {
    const category = new Category(data);
    return category.save();
  }

  async findAll() {
    return Category.find({ isActive: true });
  }

  async findById(id: string) {
    return Category.findById(id);
  }

  async update(id: string, data: Partial<ICategory>) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  async softDelete(id: string) {
    return Category.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }

  async incrementStock(id: Types.ObjectId | string, value: number = 1) {
    return Category.findByIdAndUpdate(
      id,
      { $inc: { categoryStock: value } },
      { new: true },
    );
  }
}

export default new CategoryService();