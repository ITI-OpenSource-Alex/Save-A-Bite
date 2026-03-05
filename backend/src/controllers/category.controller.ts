import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { AuthRequest } from "../middlewares/auth.middleware";
import { CategoryDto } from "../dto/category.dto";




export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    this.categoryService = new CategoryService();
  }

  createCategory = async (req: AuthRequest, res: Response) => {
    try {
      const dtoCategory: CategoryDto = req.body;
      const created = await this.categoryService.createCategory(dtoCategory);
      res.status(201).json(created);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  list = async (req: Request, res: Response) => {
    try {
      const categories = await this.categoryService.findAll();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  details = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const category = await this.categoryService.findById(id);
      if (!category) return res.status(404).json({ message: "Not found" });
      res.json(category);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };

  update = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const updated = await this.categoryService.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  };

  softDelete = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const deleted = await this.categoryService.softDelete(id);
      if (!deleted) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Category soft deleted", category: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  };
}
export default new CategoryController();