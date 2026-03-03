import mongoose, { Schema,Document, mongo }from'mongoose';
import  bcrypt from 'bcrypt';

export interface IUser extends Document{
    name : string;
    email : string;
    password : string;
    //comparePassword(candidatePassword: string): Promise<boolean>;
    phone?: string;
    role: 'user' | 'admin' | 'vendor';
    profileImage?: string;
    isEmailVerified: boolean;
    isActive: boolean;
    isDeleted: boolean;
    address?:mongoose.Types.ObjectId;
    cretedAt: Date;
    updatedAt: Date;
}



const userSchema = new Schema<IUser>(
    {
    name : {type : String, required : [true, 'Name is required'], trim: true},

    email : {type : String, required : [true, 'Email is required'], unique : true, lowercase : true, trim: true},
    password : {type : String, required : [true, 'Password is required'], minlength:[8, 'Password must be at least 8 characters']},
    phone : {type : String, trim: true},
    role : {type : String, enum : ['user', 'admin', 'vendor'], default : 'user'},
    profileImage : {type : String},
    isEmailVerified : {type : Boolean, default : false},
    isActive : {type : Boolean, default : true},
    isDeleted : {type : Boolean, default : false},
    address : {type : mongoose.Types.ObjectId, ref : 'Address'},
    },
    {timestamps : true}
);

userSchema.pre<IUser>('save', async function (next) {
  // Prevent re-hashing if the user is just updating their name or phone
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error); 
  }
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;