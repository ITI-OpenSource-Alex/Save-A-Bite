import { Response as ExpressResponse, NextFunction } from "express";
import { AuthRequest } from "../middlewares/auth.middleware";
import { vendorRequestService } from "../services/vendorRequest.service";
import { logger } from "../services/logger.service";
import { VendorRequestStatus } from "../models/vendorRequest.model";

export class VendorRequestController {
  /**
   * POST /api/vendor-requests
   * A logged-in user submits a vendor application
   */
  createRequest = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt?.userId;
      const request = await vendorRequestService.createRequest(userId, req.body);
      res.status(201).json({
        message: "Vendor request submitted successfully. Please wait for admin approval.",
        data: request,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/vendor-requests
   * Super admin gets all requests (optional ?status=pending|approved|rejected)
   */
  getAllRequests = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const status = req.query.status as string | undefined;
      const requests = await vendorRequestService.getAllRequests(status);
      res.status(200).json({ data: requests });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/vendor-requests/my
   * A user gets their own vendor requests
   */
  getMyRequests = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const requests = await vendorRequestService.getMyRequests(userId);
      res.status(200).json({ data: requests });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/vendor-requests/:id 
   * Get a single request by ID
   */
  getRequestById = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
      const request = await vendorRequestService.getRequestById(requestId);
      if (!request) {
        return res.status(404).json({ message: "Vendor request not found" });
      }
      res.status(200).json({ data: request });
    } catch (error) {
      next(error);
    }
  };

  /**
   * PATCH /api/vendor-requests/:id/review
   * Super admin approves or rejects a vendor request
   */
  reviewRequest = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const adminId = req.jwt!.userId;
      const requestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id as string;
      const { status, rejectionReason } = req.body;

      if (status === VendorRequestStatus.APPROVED) {
        const result = await vendorRequestService.approveRequest(requestId, adminId);
        return res.status(200).json({
          message: "Vendor request approved. Store created successfully.",
          data: result,
        });
      }

      if (status === VendorRequestStatus.REJECTED) {
        const result = await vendorRequestService.rejectRequest(requestId, adminId, rejectionReason);
        return res.status(200).json({
          message: "Vendor request rejected.",
          data: result,
        });
      }

      return res.status(400).json({ message: "Invalid status. Use 'approved' or 'rejected'." });
    } catch (error) {
      next(error);
    }
  };

  /**
   * DELETE /api/vendor-requests/vendors/:vendorId
   * Super admin deletes a vendor (removes store + products)
   */
  deleteVendor = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const vendorId = Array.isArray(req.params.vendorId) ? req.params.vendorId[0] : req.params.vendorId as string;
      await vendorRequestService.deleteVendor(vendorId);
      res.status(200).json({
        message: "Vendor deleted successfully. Store and all products have been removed.",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/vendor-requests/vendors
   * Super admin gets all vendors with their stores
   */
  getAllVendors = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const vendors = await vendorRequestService.getAllVendors();
      res.status(200).json({ data: vendors });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/vendor-requests/my-store
   * A vendor gets their own store info
   */
  getMyStore = async (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    try {
      const userId = req.jwt!.userId;
      const Store = (await import("../models/store.model")).default;
      const store = await Store.findOne({ ownerId: userId, isDeleted: false });
      if (!store) {
        return res.status(404).json({ message: "You don't have a store yet" });
      }
      
      const { Product } = await import("../models/product.model");
      const products = await Product.find({ storeId: store._id, isDeleted: false })
        .populate("categoryId")
        .sort({ createdAt: -1 });

      res.status(200).json({
        data: {
          store,
          products,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}

export const vendorRequestController = new VendorRequestController();
