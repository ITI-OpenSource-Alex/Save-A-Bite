import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import { AuthRequest } from "../middlewares/auth.middleware";

export class AuthController {
  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.register(req.body);
      res.status(201).json({
        message: "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      next(error);
    }
  };

  verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:4200";
    try {
      const token = req.query.token as string;
      await authService.verifyEmail(token);
      // Redirect user to the frontend login page with a success flag
      return res.redirect(`${frontendUrl}/login?verified=true`);
    } catch (error: any) {
      // Redirect to login with an error message so the frontend can display it
      const message = encodeURIComponent(error?.message || "Email verification failed");
      return res.redirect(`${frontendUrl}/login?verified=false&reason=${message}`);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokens = await authService.login(req.body);
      res.status(200).json({ message: "Login successful", data: tokens });
    } catch (error) {
      next(error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshToken(refreshToken);
      res.status(200).json({ message: "Token refreshed successfully", data: tokens });
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization!.split(" ")[1];
      await authService.logout(req.jwt!.userId, token);
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      next(error);
    }
  };

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.forgotPassword(req.body.email);
      // Always respond with 200 to avoid user enumeration
      res.status(200).json({
        message: "If an account with that email exists, an OTP has been sent.",
      });
    } catch (error) {
      next(error);
    }
  };

  verifyResetOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.verifyResetOtp(req.body);
      res.status(200).json({ message: "OTP verified successfully." });
    } catch (error) {
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authService.resetPassword(req.body);
      res.status(200).json({
        message: "Password reset successfully. Please log in with your new password.",
      });
    } catch (error) {
      next(error);
    }
  };

  updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const updatedUser = await authService.updateProfile(req.jwt!.userId, req.body);
      res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
      next(error);
    }
  };
}

export const authController = new AuthController();
