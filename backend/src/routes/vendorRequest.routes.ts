import { Router } from "express";
import { vendorRequestController } from "../controllers/vendorRequest.controller";
import { IsAuthenticatedMiddleware, AuthorizeRoles } from "../middlewares/auth.middleware";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { CreateVendorRequestDto, ReviewVendorRequestDto } from "../dto/vendorRequest.dto";
import { Role } from "../enum/role.enum";

const router = Router();

// ─── User routes ───────────────────────────────────────────

// Submit a vendor request (authenticated user OR guest)
router.post(
  "/",
  ValidationMiddleware(CreateVendorRequestDto),
  vendorRequestController.createRequest
);

// Get my vendor requests
router.get(
  "/my",
  IsAuthenticatedMiddleware,
  vendorRequestController.getMyRequests
);

// Get my store (vendor only)
router.get(
  "/my-store",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.VENDOR),
  vendorRequestController.getMyStore
);

// ─── Super Admin routes ────────────────────────────────────

// Get all vendor requests
router.get(
  "/",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN),
  vendorRequestController.getAllRequests
);

// Get a single vendor request
router.get(
  "/:id",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN),
  vendorRequestController.getRequestById
);

// Approve or reject a vendor request
router.patch(
  "/:id/review",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN),
  ValidationMiddleware(ReviewVendorRequestDto),
  vendorRequestController.reviewRequest
);

// Get all vendors
router.get(
  "/vendors/list",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN),
  vendorRequestController.getAllVendors
);

// Delete a vendor (removes store + products)
router.delete(
  "/vendors/:vendorId",
  IsAuthenticatedMiddleware,
  AuthorizeRoles(Role.SUPER_ADMIN),
  vendorRequestController.deleteVendor
);

export default router;
