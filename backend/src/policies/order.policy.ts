import { IOrder } from "../models/order.model";
import { ORDER_STATUS } from "../enum/order.enum";
import User, { IUser } from "../models/user.model";
import { Role } from "../enum/role.enum";
import { Policy } from "./policy";
export class OrderPolicy extends Policy<IOrder> {
  canRead = (user: IUser, order: IOrder): boolean => {
    const isOwner = user._id.equals(order.userId);
    if (isOwner) return true;
    return super.canRead(user, order);
  };

  canCancel = (user: IUser, order: IOrder): boolean => {
    const isOwner = user._id.equals(order.userId);
    const isCancellable =
      order.status === ORDER_STATUS.PLACED || order.status === ORDER_STATUS.PROCESSING;

    if (isOwner && isCancellable) {
      return true;
    }
    return super.canUpdate(user, order);
  };
}

export const orderPolicy = new OrderPolicy();
