import { IProduct } from "../models/product.model";
import { IUser } from "../models/user.model";
import { Policy } from "./policy";
import { IStore } from "../models/store.model";
export class ProductPolicy extends Policy<IProduct> {


    private isAuthorizedVendor(user:IUser, product:IProduct):boolean{
        if (!this.isVendor(user) || !product) return false;
        const store = product.storeId as unknown as IStore // for referring an object in mongodb
        if (!store || !store.ownerId) {
            console.warn("ProductPolicy: storeId was not populated on the product document.");
            return false; 
        }
        return user._id.equals(store.ownerId);
    }


    canRead = (user: IUser, product: IProduct): boolean => {
        if (product.isActive) return true
        if (this.isAuthorizedVendor(user, product))return true
        return super.canRead(user, product);
    }


    canCreate = (user: IUser, product: IProduct): boolean => {
        if (this.isVendor(user)) return true
        return super.canCreate(user, product)
    }

    canUpdate =(user: IUser, product: IProduct): boolean=> {
        // A vendor can only update products linked to their specific store
        if (this.isAuthorizedVendor(user, product))return true
        return super.canUpdate(user, product);
    }

    canDelete =(user: IUser, product: IProduct): boolean => {
        if (this.isAuthorizedVendor(user, product))return true
        return super.canDelete(user, product)
    
    }


}

export const productPolicy = new ProductPolicy()