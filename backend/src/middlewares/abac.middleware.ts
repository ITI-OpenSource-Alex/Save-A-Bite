import { AuthRequest } from "./auth.middleware";
import { Response as ExpressResponse } from "express";
import { IUser } from "../models/user.model";
import { NextFunction } from "express";
import ForbiddenAccessException from "../exceptions/forbidden-access.exception";
import NotFoundException from "../exceptions/not-found.exception";


export interface AbacRequest<ResourceT = any> extends AuthRequest {
    user?: IUser
    resource?: ResourceT
}

export const AuthorizeRoles = <ResourceT>(
    policyEvaluator: (user: any, resource: ResourceT) => boolean,
    resourceFetcher: (req: AbacRequest)=>Promise<ResourceT | null>) =>{
        return async (req: AbacRequest<ResourceT>, res: ExpressResponse, next: NextFunction) => {
            try{
                if (!req.user){
                    return next(new ForbiddenAccessException("Access denied: User context is missing."));
                }
                let targetResource: ResourceT | undefined

                if (resourceFetcher){
                    const fetched = await resourceFetcher(req)

                    if (!fetched){
                        return next(new NotFoundException("Resource not found"))
                    }
                    targetResource = fetched;
                    req.resource = targetResource;
                }

                const isAllowed = policyEvaluator(req.user, targetResource as ResourceT)

                if (!isAllowed){
                    return next(new ForbiddenAccessException("Access denied: User context is missing.") )
                }

                next()
            }
            catch(error){
                next(error)
            }
        }
    }
