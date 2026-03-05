import { Service } from "typedi";
import { ICategory, Category } from "../models/category.model";
import mongoose, { Types } from "mongoose";
const { ObjectId } = Types;

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

  async incrementStock(
    id: string,
    value: number = 1,
  ): Promise<ICategory | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("Invalid category ID");
    }
    return Category.findByIdAndUpdate(
      id,
      { $inc: { categoryStock: value } },
      { new: true },
    );
  }
}

export default new CategoryService();