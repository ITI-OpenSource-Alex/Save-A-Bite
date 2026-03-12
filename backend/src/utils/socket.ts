import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { NotificationService } from '../services/notification.service';

let io: Server;
const notificationService = new NotificationService();

export enum SOCKET_ROOMS {
  NOTIFICATIONS = 'notifications',
}

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:4200", 
      methods: ["GET", "POST", "PATCH"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join general notification room
    socket.join(SOCKET_ROOMS.NOTIFICATIONS);

    // Join personal room if userId is provided
    socket.on('joinUserRoom', (userId: string) => {
      socket.join(userId);
      console.log(`User ${userId} joined their personal notification room`);
    });

    socket.on('markAsRead', async ({ notificationId, userId }) => {
      try {
        console.log(`User ${userId} read notification ${notificationId}`);
        await notificationService.markNotificationAsRead(new mongoose.Types.ObjectId(userId), notificationId);
      } catch (error) {
        console.error('Error marking notification as read via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

export const pushNotificationToClients = (data: any) => {
  if (io) {
    io.to(SOCKET_ROOMS.NOTIFICATIONS).emit('notifications', data);
  }
};

export const pushToUser = (userId: string, data: any) => {
  if (io) {
    io.to(userId).emit('notifications', data);
  }
};
