import { IUser } from "../models/user.model";
import { Policy } from "./policy";



export class UserPolicy extends Policy<IUser>{
    private isSelf =(actor:IUser, target:IUser): boolean =>{
        const actorId = actor.id || actor._id
        const targetId = target.id || target._id

        if (!actorId || !targetId) return false
        return actorId.toString() === targetId.toString();
    }

    canRead = (user:IUser, target:IUser): boolean => {
        if (this.isSelf(user, target)) return true
        return super.canRead(user, target)
    }

    canCreate = (actor: IUser): boolean =>{
        return this.hasElevatedRole(actor)
    }

    canUpdate = (user:IUser, target:IUser): boolean => {
        if (this.isSelf(user, target)) return true
        return super.canUpdate(user, target)
    }

    canDelete = (user:IUser, target:IUser): boolean => {
        if (this.isSelf(user, target)) return true
        return super.canDelete(user, target)
    }
}

export const userPolicy = new UserPolicy()