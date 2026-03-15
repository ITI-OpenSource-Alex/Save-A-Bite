import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import ValidationMiddleware from "../middlewares/validation.middleware";
import { IsAuthenticatedMiddleware } from "../middlewares/auth.middleware";
import { createAccountLimiter, loginLimiter } from "../utils/ratelimit";
import {
  RegisterDto,
  LoginDto,
  RefreshTokenDto,
  VerifyEmailDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangeEmailDto,
  VerifyChangeEmailDto,
  UpdateProfileDto,
} from "../dto/auth.dto";

const router = Router();

// Public routes
router.post("/register", createAccountLimiter, ValidationMiddleware(RegisterDto), authController.register);
router.get(
  "/verify-email",
  ValidationMiddleware(VerifyEmailDto, "query"),
  authController.verifyEmail
);
router.post("/login", loginLimiter, ValidationMiddleware(LoginDto), authController.login);
router.post("/refresh-token", ValidationMiddleware(RefreshTokenDto), authController.refreshToken);
router.post(
  "/forgot-password",
  loginLimiter,
  ValidationMiddleware(ForgotPasswordDto),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  loginLimiter,
  ValidationMiddleware(ResetPasswordDto),
  authController.resetPassword
);

// Protected routes (require valid JWT)
router.put(
  "/update-profile",
  IsAuthenticatedMiddleware,
  ValidationMiddleware(UpdateProfileDto),
  authController.updateProfile
);
router.post("/logout", IsAuthenticatedMiddleware, authController.logout);

export default router;
