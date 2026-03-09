import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";

export class UserController {
  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      res.status(200).json({
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
