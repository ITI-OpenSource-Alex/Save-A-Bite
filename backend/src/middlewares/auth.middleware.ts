import { Request, Response as ExpressResponse, NextFunction } from "express";
import UnauthorizedException from "../exceptions/unauthorized.exception";
import env from "../config/env.config";
import jwt from "jsonwebtoken";
import { JwtDto } from "../dto/jwt.dto";
import User, { IUser } from "../models/user.model";
import { Role } from "../enum/role.enum";

export interface AuthRequest extends Request {
  jwt?: JwtDto;
  user?: IUser;
  paginationOpts?: {
    page: number;
    pageSize: number;
  };
}

const verifyToken = (token: string): JwtDto => {
  try {
    return jwt.verify(token, env.JWT.SECRET as string) as JwtDto;
  } catch (error) {
    throw new UnauthorizedException("Invalid or expired token");
  }
};

export const IsAuthenticatedMiddleware = async (
  req: AuthRequest,
  res: ExpressResponse,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new UnauthorizedException("No token provided"));
    }

    const token = authorization.split(" ")[1];
    const jwtPayload = verifyToken(token);

    // Fetch user from DB using id from token payload
    const user = await User.findById(jwtPayload.userId).exec();

    if (!user) {
      return next(new UnauthorizedException("User not found"));
    }

    // Check if token is blacklisted in user's tokenBlacklist array
    if (Array.isArray(user.tokenBlacklist) && user.tokenBlacklist.includes(token)) {
      return next(new UnauthorizedException("Token has been revoked"));
    }

    // Attach jwt payload and user to request for downstream use
    req.jwt = jwtPayload;
    req.user = user;

    return next();
  } catch (err: any) {
    res.setHeader("Www-Authenticate", "Bearer");
    return next(new UnauthorizedException(err.message));
  }
};

export const AuthorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, res: ExpressResponse, next: NextFunction) => {
    if (!req.jwt) {
      return next(new UnauthorizedException("User is not authenticated"));
    }

    if (!allowedRoles.includes(req.jwt.role)) {
      return next(new UnauthorizedException("You do not have permission to perform this action"));
    }

    next();
  };
};
