import { VendorRequest, IVendorRequest, VendorRequestStatus } from "../models/vendorRequest.model";
import User from "../models/user.model";
import Store from "../models/store.model";
import { Product } from "../models/product.model";
import { Role } from "../enum/role.enum";
import { logger } from "./logger.service";
import BadRequestException from "../exceptions/bad-request.exception";
import NotFoundException from "../exceptions/not-found.exception";
import ConflictException from "../exceptions/conflict.exception";
import mongoose from "mongoose";
import { sendVendorApprovalEmail, sendVendorRejectionEmail } from "../send-mails/emailService";

export class VendorRequestService {
  /**
   * Submit a request. If userId is provided, links it to an existing user.
   * If userId is not provided, creates a new user account first.
   */
  async createRequest(userId: string | undefined, data: any): Promise<IVendorRequest> {
    let finalUserId = userId;
    let isNewUser = false;

    if (!finalUserId) {
      if (!data.email || !data.password || !data.name) {
        throw new BadRequestException("User registration details (name, email, password) are required for guests");
      }

      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        finalUserId = (existingUser._id as any).toString();
        logger.info(`Guest vendor application linked to existing user: ${finalUserId}`);
      } else {
        const newUser = new User({
          name: data.name,
          email: data.email,
          password: data.password,
          role: Role.USER, 
          isEmailVerified: true, // Auto-verify but keep inactive until approved
          isActive: false,       // BLOCK login until admin approves
        });

        await newUser.save();
        finalUserId = (newUser._id as any).toString();
        isNewUser = true;
        logger.info(`New user ${finalUserId} created and locked during guest vendor application`);
      }
    }

    // Check if user already has a pending request
    const existingPending = await VendorRequest.findOne({
      userId: finalUserId,
      status: VendorRequestStatus.PENDING,
    });
    if (existingPending) {
      throw new ConflictException("You already have a pending vendor request");
    }

    // Check if user is already a vendor
    const user = await User.findById(finalUserId);
    if (!user) throw new NotFoundException("User not found");
    if (user.role === Role.VENDOR) {
      throw new ConflictException("You are already a vendor");
    }

    const vendorRequest = new VendorRequest({
      userId: finalUserId,
      storeName: data.storeName,
      storeDescription: data.storeDescription,
      storePhone: data.storePhone,
      storeEmail: data.storeEmail,
      storeLogoUrl: data.storeLogoUrl,
      message: data.message,
      status: VendorRequestStatus.PENDING,
      isNewUser: isNewUser,
    });

    await vendorRequest.save();
    logger.info(`Vendor request created by user: ${finalUserId}`);
    return vendorRequest;
  }

  /**
   * Get all vendor requests (for super admin)
   */
  async getAllRequests(status?: string): Promise<IVendorRequest[]> {
    const query: any = {};
    if (status) query.status = status;

    return VendorRequest.find(query)
      .populate("userId", "name email phone profileImage")
      .populate("reviewedBy", "name email")
      .sort({ createdAt: -1 });
  }

  /**
   * Get a single request by ID
   */
  async getRequestById(requestId: string): Promise<IVendorRequest | null> {
    return VendorRequest.findById(requestId)
      .populate("userId", "name email phone profileImage")
      .populate("reviewedBy", "name email");
  }

  /**
   * Get requests for a specific user
   */
  async getMyRequests(userId: string): Promise<IVendorRequest[]> {
    return VendorRequest.find({ userId }).sort({ createdAt: -1 });
  }

  /**
   * Super admin approves a vendor request:
   * 1. Update request status
   * 2. Change user role to VENDOR and Activate account
   * 3. Create the store immediately
   */
  async approveRequest(requestId: string, adminId: string): Promise<{ request: IVendorRequest; store: any }> {
    const request = await VendorRequest.findById(requestId);
    if (!request) throw new NotFoundException("Vendor request not found");
    if (request.status !== VendorRequestStatus.PENDING) {
      throw new BadRequestException("This request has already been reviewed");
    }

    // 1. Update request status
    request.status = VendorRequestStatus.APPROVED;
    request.reviewedBy = new mongoose.Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    await request.save();

    // 2. Update user role to VENDOR and Activate account
    const user = await User.findByIdAndUpdate(
      request.userId,
      { role: Role.VENDOR, isActive: true, isEmailVerified: true },
      { new: true }
    );

    // 3. Create the store immediately
    const store = new Store({
      name: request.storeName,
      description: request.storeDescription,
      ownerId: request.userId,
      phone: request.storePhone,
      email: request.storeEmail,
      logoUrl: request.storeLogoUrl,
      isActive: true,
      isDeleted: false,
    });
    await store.save();

    // 4. Send email notification
    try {
      const recipientEmail = user ? user.email : request.storeEmail;
      await sendVendorApprovalEmail(recipientEmail, request.storeName);
    } catch (emailError) {
      logger.error(`Failed to send approval email for request ${requestId}:`, emailError);
    }

    logger.info(`Vendor request ${requestId} approved. Store ${store._id} created for user ${request.userId}`);

    return { request, store };
  }

  /**
   * Super admin rejects a vendor request
   */
  async rejectRequest(requestId: string, adminId: string, rejectionReason?: string): Promise<IVendorRequest> {
    const request = await VendorRequest.findById(requestId);
    if (!request) throw new NotFoundException("Vendor request not found");
    if (request.status !== VendorRequestStatus.PENDING) {
      throw new BadRequestException("This request has already been reviewed");
    }

    request.status = VendorRequestStatus.REJECTED;
    request.reviewedBy = new mongoose.Types.ObjectId(adminId);
    request.reviewedAt = new Date();
    request.rejectionReason = rejectionReason || "Your vendor application was not approved.";
    await request.save();

    // Send email notification
    try {
      const user = await User.findById(request.userId);
      const recipientEmail = user ? user.email : request.storeEmail;
      await sendVendorRejectionEmail(recipientEmail, request.storeName, request.rejectionReason);
    } catch (emailError) {
      logger.error(`Failed to send rejection email for request ${requestId}:`, emailError);
    }

    // If it was a new user created for this request, delete them on rejection
    if (request.isNewUser) {
      await User.findByIdAndDelete(request.userId);
      logger.info(`User ${request.userId} deleted due to vendor request rejection`);
    }

    logger.info(`Vendor request ${requestId} rejected by admin ${adminId}`);
    return request;
  }

  /**
   * Super admin deletes a vendor: 
   * - Set user role back to USER
   * - Soft-delete the vendor's store
   * - Soft-delete all products in the store
   */
  async deleteVendor(vendorId: string): Promise<void> {
    const vendor = await User.findById(vendorId);
    if (!vendor) throw new NotFoundException("Vendor not found");
    if (vendor.role !== Role.VENDOR) {
      throw new BadRequestException("This user is not a vendor");
    }

    // 1. Set user role back to USER
    vendor.role = Role.USER;
    await vendor.save({ validateBeforeSave: false });

    // 2. Soft-delete all stores owned by this vendor
    const stores = await Store.find({ ownerId: vendorId, isDeleted: false });
    const storeIds = stores.map(s => s._id);

    await Store.updateMany(
      { ownerId: vendorId },
      { isDeleted: true, isActive: false }
    );

    // 3. Soft-delete all products in those stores
    if (storeIds.length > 0) {
      await Product.updateMany(
        { storeId: { $in: storeIds } },
        { isDeleted: true, isActive: false }
      );
    }

    logger.info(`Vendor ${vendorId} deleted. All stores and products removed.`);
  }

  /**
   * Get all vendors (for super admin)
   */
  async getAllVendors() {
    const vendors = await User.find({ role: Role.VENDOR, isDeleted: false })
      .select("-password -tokenBlacklist -verificationToken -verificationTokenExpiresAt -otpCode -otpExpiresAt");

    // For each vendor, get their store
    const vendorsWithStores = await Promise.all(
      vendors.map(async (vendor) => {
        const store = await Store.findOne({ ownerId: vendor._id, isDeleted: false });
        const productCount = store
          ? await Product.countDocuments({ storeId: store._id, isDeleted: false })
          : 0;
        return {
          vendor: vendor.toObject(),
          store: store ? store.toObject() : null,
          productCount,
        };
      })
    );

    return vendorsWithStores;
  }
}

export const vendorRequestService = new VendorRequestService();
