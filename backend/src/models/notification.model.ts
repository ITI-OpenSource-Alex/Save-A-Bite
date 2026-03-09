import mongoose, { Document, Schema } from 'mongoose';
import { NotificationResource } from '../enum/notification.enum';

export interface INotification extends Document {
  id: string;
  message: string;
  resource: NotificationResource;
  resourceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    message: { type: String, required: true },
    resource: {
      type: String,
      enum: Object.values(NotificationResource),
      required: true,
    },
    resourceId: { type: String },
  },
  {
    timestamps: true,
  },
);

const Notification = mongoose.model<INotification>('Notification', notificationSchema);
export default Notification;
