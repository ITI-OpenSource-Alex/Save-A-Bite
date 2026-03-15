import { Router, Request, Response } from "express";
import { upload } from "../middlewares/upload.middleware";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import env from "../config/env.config";

const router = Router();

router.post("/", IsAuthenticatedMiddleware, upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 400, message: "No file uploaded" });
  }

  // Determine site URL from env or request
  const siteUrl = `http://localhost:${env.APP.PORT}`;
  const imageUrl = `${siteUrl}/uploads/${req.file.filename}`;

  res.json({
    status: 200,
    message: "Image uploaded successfully",
    data: {
      url: imageUrl,
      filename: req.file.filename
    }
  });
});

export default router;
