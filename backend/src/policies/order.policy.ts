import { IOrder } from "../models/order.model";
import { ORDER_STATUS } from "../enum/order.enum";
import User, { IUser } from "../models/user.model";
import { Role } from "../enum/role.enum";
export class OrderPolicy {
    canRead = (user: IUser, order: IOrder): boolean => {
        const isOwner = user._id.equals(order.userId)

        return isOwner || this.hasElevatedRole(user)
    }

    canCancel = (user: IUser, order: IOrder): boolean =>{
        const isOwner = user._id.equals(order.userId)
        const isPlaced = order.status === ORDER_STATUS.PLACED || order.status === ORDER_STATUS.PROCESSING

        return (isOwner || this.hasElevatedRole(user)) && isPlaced
    }

    canUpdateStatus = (user: IUser, order: IOrder): boolean =>{
        return this.hasElevatedRole(user) // vendor can't change status because one order can contain multiple items from different vendors
    }

    private hasElevatedRole = (user: IUser): boolean =>{
        return [Role.ADMIN, Role.SUPER_ADMIN].includes(user.role)
    }


}

export const orderPolicy = new OrderPolicy()    