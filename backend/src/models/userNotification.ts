import mongoose, { Document, Schema } from 'mongoose';

export interface IUserNotification extends Document {
  id: string;
  notification: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

const userNotificationSchema = new Schema<IUserNotification>(
  {
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      nullable: true,
    },
  },
  {
    timestamps: true,
  },
);

const UserNotification = mongoose.model<IUserNotification>('UserNotification', userNotificationSchema);

export default UserNotification;
