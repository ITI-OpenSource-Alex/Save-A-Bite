import { Role } from "../enum/role.enum";
import { IProduct } from "../models/product.model";
import { IUser } from "../models/user.model";


export abstract class Policy<T>{
    protected hasElevatedRole(user?: IUser): boolean{
        const elevatedRoles = [Role.ADMIN, Role.SUPER_ADMIN];
        return elevatedRoles.includes(user?.role as Role)
    }

    protected isVendor(user:IUser):boolean{
        return user.role === Role.VENDOR
    }
    
    canRead(user:IUser, resource: T): boolean{
        return this.hasElevatedRole(user);
    }
    canCreate(user:IUser, resource?: T): boolean{
        return this.hasElevatedRole(user);
    }
    canUpdate(user:IUser, resource: T): boolean{
        return this.hasElevatedRole(user);
    }
    canDelete(user:IUser, resource: T): boolean{
        return this.hasElevatedRole(user);
    }
    
}