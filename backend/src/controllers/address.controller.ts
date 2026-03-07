import { Response as ExpressResponse, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Container } from 'typedi';
import { AddressService } from '../services/address.service';
import { logger } from '../services/logger.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { CreateAddressDto } from '../dto/address.dto';

export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = Container.get(AddressService);
  }

  addAddress = async (
    req: AuthRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.jwt?.userId;
      const addressData: CreateAddressDto = req.body;
      const newAddress = await this.addressService.createAddress({
        ...addressData,
        user: userId as any, // Casting to any is often enough for Mongoose models if they accept strings too, or use new mongoose.Types.ObjectId(userId)
      });

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        data: newAddress,
      });
    } catch (error) {
      logger.error('Error adding address:', error);
      next(error);
    }
  };

  getMyAddresses = async (
    req: AuthRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<void> => {
    try {
      const userId = req.jwt?.userId;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const addresses = await this.addressService.getAddressesByUserId(userId);

      res.status(200).json({
        success: true,
        data: addresses,
      });
    } catch (error) {
      logger.error('Error fetching user addresses:', error);
      next(error);
    }
  };

  updateAddress = async (
    req: AuthRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const updatedAddress = await this.addressService.updateAddressById(id, req.body);

      if (!updatedAddress) {
        res.status(404).json({ success: false, message: 'Address not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Address updated successfully',
        data: updatedAddress,
      });
    } catch (error) {
      logger.error('Error updating address:', error);
      next(error);
    }
  };

  deleteAddress = async (
    req: AuthRequest,
    res: ExpressResponse,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const deletedAddress = await this.addressService.deleteAddressById(id);

      if (!deletedAddress) {
        res.status(404).json({ success: false, message: 'Address not found' });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    } catch (error) {
      logger.error('Error deleting address:', error);
      next(error);
    }
  };
}

export const addressController = new AddressController();
