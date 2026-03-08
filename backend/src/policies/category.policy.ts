



import { Policy } from './policy';
import { ICategory } from '../models/category.model';
import { IUser } from '../models/user.model';
export class CategoryPolicy extends Policy<ICategory>{
    canRead = (user: any, category: ICategory): boolean => {
        return true;
    }

    canCreate = (user: any): boolean => {
        return super.canCreate(user);
    }

    canDelete(user: IUser, category: ICategory): boolean {
        return super.canDelete(user, category);
    }

    canUpdate(user: IUser, resource: ICategory): boolean {
        return super.canUpdate(user, resource);
    }
}

export const categoryPolicy = new CategoryPolicy();