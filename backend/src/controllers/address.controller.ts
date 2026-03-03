import { Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { AddressService } from '../services/address.service';
import {logger} from "../services/logger.service";

export const addAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const addressService = Container.get(AddressService);
                if (!req.body.user || !req.body.street || !req.body.city || !req.body.phone) {
            res.status(400).json({ success: false, message: 'Missing required address fields' });
            return;
        }

        const newAddress = await addressService.createAddress(req.body);

        res.status(201).json({
            success: true,
            message: 'Address added successfully',
            data: newAddress
        });
    } catch (error) {
        logger.error('Error adding address:', error);
        next(error);
        }
};

export const getUserAddresses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const addressService = Container.get(AddressService);
        const { userId } = req.params as { userId: string };

        const addresses = await addressService.getAddressesByUserId(userId);

        res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        logger.error('Error fetching user addresses:', error);
        next(error);
    }
};

// 3. PATCH /addresses/:id - Update an address
export const updateAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const addressService = Container.get(AddressService);
        const { id } = req.params as { id: string };

        const updatedAddress = await addressService.updateAddressById(id, req.body);

        if (!updatedAddress) {
            res.status(404).json({ success: false, message: 'Address not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
            data: updatedAddress
        });
    } catch (error) {
        logger.error('Error updating address:', error);
        next(error);
    }
};

// 4. DELETE /addresses/:id - Delete an address
export const deleteAddress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const addressService = Container.get(AddressService);
        const { id } = req.params as { id: string };

        const deletedAddress = await addressService.deleteAddressById(id);

        if (!deletedAddress) {
            res.status(404).json({ success: false, message: 'Address not found' });
            return;
        }

        res.status(200).json({
            success: true,
            message: 'Address deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting address:', error); 
        next(error);
    }
};