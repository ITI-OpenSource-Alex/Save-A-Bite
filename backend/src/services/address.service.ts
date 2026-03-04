// Depending on your team's setup, this import might be from 'typedi' or a similar DI container
import { Service } from 'typedi'; 
import Address, { IAddress } from '../models/address.model';

@Service()
export class AddressService {
    
   
    public async createAddress(addressData: Partial<IAddress>): Promise<IAddress> {
        const address = new Address(addressData);
        return await address.save();
    }

    public async getAddressesByUserId(userId: string): Promise<IAddress[]> {
        return await Address.find({ user: userId });
    }

    public async updateAddressById(addressId: string, updateData: Partial<IAddress>): Promise<IAddress | null> {
        return await Address.findByIdAndUpdate(addressId, updateData, {
            new: true,
            runValidators: true,
        });
    }

    public async deleteAddressById(addressId: string): Promise<IAddress | null> {
        return await Address.findByIdAndDelete(addressId);
    }
}