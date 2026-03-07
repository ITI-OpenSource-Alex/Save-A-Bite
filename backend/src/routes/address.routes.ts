import { Router } from "express";
import { addressController } from "../controllers/address.controller";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreateAddressDto } from "../dto/address.dto";

const router = Router();

router.post(
  "/",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(CreateAddressDto),
  addressController.addAddress,
);
router.get("/", IsAuthenticatedMiddleware, addressController.getMyAddresses);
router.patch(
  "/:id",
  IsAuthenticatedMiddleware,
  addressController.updateAddress,
);
router.delete(
  "/:id",
  IsAuthenticatedMiddleware,
  addressController.deleteAddress,
);

export default router;
