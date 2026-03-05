import { Request, Response, NextFunction } from "express";
import { CategoryService } from "../services/category.service";
import { AuthRequest } from "../middlewares/auth.middleware";

const categoryService = new CategoryService();

export class CategoryController {
  async createCategory(req: AuthRequest, res: Response) {
    try {
      const category = await categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const categories = await categoryService.findAll();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async details(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const category = await categoryService.findById(id);
      if (!category) return res.status(404).json({ message: "Not found" });
      res.json(category);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const updated = await categoryService.update(id, req.body);
      if (!updated) return res.status(404).json({ message: "Not found" });
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async softDelete(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) return res.status(400).json({ message: "Invalid category ID" });

    try {
      const deleted = await categoryService.softDelete(id);
      if (!deleted) return res.status(404).json({ message: "Not found" });
      res.json({ message: "Category soft deleted", category: deleted });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

// export { isAdmin };
export const categoryController = new CategoryController();
