import { Service } from "typedi";
import { ICategory, Category } from "../models/category.model";

@Service()
export class CategoryService {
  async createCategory(data: Partial<ICategory>) {
    const category = new Category();
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
}
