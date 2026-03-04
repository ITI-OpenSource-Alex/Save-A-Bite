import User, { IUser } from '../models/user.model';

export class UserService {

    // ----------------- Get All Users -----------------
    async getAllUsers(): Promise<IUser[]> {
        // Find all users and exclude their passwords and sensitive fields
        const users = await User.find().select('-password -otpCode -otpExpiresAt -verificationToken -verificationTokenExpiresAt -tokenBlacklist');
        return users;
    }

}

export const userService = new UserService();
