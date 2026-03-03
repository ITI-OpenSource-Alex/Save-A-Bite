import { Router } from "express";
import {
  CategoryController,
  isAdmin,
} from "../controllers/category.controller";

const router = Router();
const controller = new CategoryController();

// Public endpoints
router.get("/", (req, res) => controller.list(req, res));
router.get("/:id", (req, res) => controller.details(req, res));

// Admin-only endpoints
router.post("/", isAdmin, (req, res) => controller.create(req, res));
router.patch("/:id", isAdmin, (req, res) => controller.update(req, res));
router.delete("/:id", isAdmin, (req, res) => controller.softDelete(req, res));

export default router;
