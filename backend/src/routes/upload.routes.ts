import { Router, Request, Response } from "express";
import { upload } from "../middlewares/upload.middleware";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", IsAuthenticatedMiddleware, upload.single("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ status: 400, message: "No file uploaded" });
  }

  // Cloudinary stores the full secure URL in req.file.path
  const imageUrl = req.file.path;

  res.json({
    status: 200,
    message: "Image uploaded successfully",
    data: {
      url: imageUrl,
      filename: req.file.filename // Cloudinary provides a filename/public_id as well
    }
  });
});

export default router;
