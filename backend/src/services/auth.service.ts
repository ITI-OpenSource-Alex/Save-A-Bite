import crypto from 'crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User, { IUser } from '../models/user.model';
import env from '../config/env.config';
import { JwtDto } from '../dto/jwt.dto';
import { RegisterDto, LoginDto, ResetPasswordDto, VerifyChangeEmailDto } from '../dto/auth.dto';
import { sendVerifyEmail, sendOtpEmail } from '../send-mails/emailService';
import UnauthorizedException from '../exceptions/unauthorized.exception';
import ConflictException from '../exceptions/conflict.exception';
import NotFoundException from '../exceptions/not-found.exception';
import BadRequestException from '../exceptions/bad-request.exception';

// ─── Helpers ────────────────────────────────────────────────────────────────

const generateToken = () => crypto.randomBytes(32).toString('hex');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit

const signTokens = (user: IUser): { accessToken: string; refreshToken: string } => {
  const accessPayload: JwtDto = {
    userId: (user._id as any).toString(),
    role: user.role,
    email: user.email,
  };
  // Refresh token should be lightweight, it only needs the userId
  const refreshPayload = {
    userId: (user._id as any).toString(),
  };

  const accessToken = jwt.sign(accessPayload, env.JWT.SECRET as string, {
    expiresIn: env.JWT.EXPIRE as any,
  });
  const refreshToken = jwt.sign(refreshPayload, env.JWT.REFRESH_SECRET as string, {
    expiresIn: env.JWT.REFRESH_EXPIRE as any,
  });
  return { accessToken, refreshToken };
};

export class AuthService {
  // ----------------- Register -----------------
  async register(data: RegisterDto): Promise<void> {
    const { email, password, name, phone, confirmPassword } = data;

    if (password !== confirmPassword) throw new BadRequestException('Passwords do not match');

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but is unverified, resend the email
      if (!existingUser.isEmailVerified) {
        const token = generateToken();
        existingUser.verificationToken = token;
        existingUser.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await existingUser.save({ validateBeforeSave: false });
        await sendVerifyEmail(email, token);
        return;
      }
      throw new ConflictException('An account with this email already exists');
    }

    const verificationToken = generateToken();

    // Save user as unverified — isEmailVerified defaults to false
    const newUser = new User({
      name,
      email,
      password,
      phone,
      isEmailVerified: false,
      verificationToken,
      verificationTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    await newUser.save();
    await sendVerifyEmail(email, verificationToken);
  }

  async verifyEmail(token: string): Promise<void> {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: new Date() },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid or expired verification link');
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
  }

  async login(data: LoginDto): Promise<{ accessToken: string; refreshToken: string }> {
    const { email, password } = data;

    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) throw new UnauthorizedException('Invalid email or password');

    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    if (!user.isActive || user.isDeleted) {
      throw new UnauthorizedException('Your account has been disabled');
    }

    const tokens = signTokens(user);
    return tokens;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, env.JWT.REFRESH_SECRET as string) as JwtDto;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive || user.isDeleted) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const payload: JwtDto = {
        userId: (user._id as any).toString(),
        role: user.role,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, env.JWT.SECRET as string, {
        expiresIn: env.JWT.EXPIRE as any,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, token: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    user.tokenBlacklist = user.tokenBlacklist || [];
    user.tokenBlacklist.push(token);
    await user.save({ validateBeforeSave: false });
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user || !user.isEmailVerified) return;

    const otp = generateOtp();
    user.otpCode = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    await sendOtpEmail(email, otp, 'reset-password');
  }

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    const { email, otp, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) throw new BadRequestException('Passwords do not match');

    const user = await User.findOne({
      email,
      otpExpiresAt: { $gt: new Date() },
    });
    if (!user || !user.otpCode) throw new BadRequestException('Invalid or expired OTP');

    const isOtpValid = await bcrypt.compare(otp, user.otpCode);
    if (!isOtpValid) throw new BadRequestException('Invalid or expired OTP');

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpiresAt = undefined;
    user.tokenBlacklist = [];
    await user.save();
  }

  async updateProfile(userId: string, data: any): Promise<any> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    if (data.email && data.email !== user.email) {
      const conflict = await User.findOne({ email: data.email });
      if (conflict) throw new ConflictException('This email is already in use');

      user.isEmailVerified = false;

      const token = generateToken();
      user.verificationToken = token;
      user.verificationTokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      await sendVerifyEmail(data.email, token);
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.phone) user.phone = data.phone;

    await user.save();

    const updatedUser = user.toObject() as any;
    delete updatedUser.password;
    delete updatedUser.verificationToken;
    delete updatedUser.verificationTokenExpiresAt;
    delete updatedUser.tokenBlacklist;

    return updatedUser;
  }
}

export const authService = new AuthService();
