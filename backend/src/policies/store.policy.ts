import { Policy } from "./policy";
import { IStore } from "../models/store.model";
import { IUser } from "../models/user.model";
import { Role } from "../enum/role.enum";


export class StorePolicy extends Policy<IStore> {
    private isOwner = (user: IUser, store:IStore): boolean =>{
        if (user.role !== Role.VENDOR) return false
        return user._id.equals(store.ownerId)
    }

    canRead =(user: IUser, store: IStore): boolean => { // everyone can see store's profile ig, not sure
        return true
    }

    canUpdate = (user: IUser, store:IStore):boolean => {
        if (this.isOwner(user, store)) return true;
        return super.canUpdate(user, store)
    }

    canDelete = (user: IUser, store:IStore):boolean => {
        if (this.isOwner(user, store)) return true;
        return super.canDelete(user, store)
    }

    canCreate = (user: IUser):boolean =>{
        if (user.role === Role.VENDOR) return true
        return super.canCreate(user)
    }

}

export const storePolicy = new StorePolicy()