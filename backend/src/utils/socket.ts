import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:4200", 
      methods: ["GET", "POST", "PATCH"]
    }
  });

  io.on('connection', (socket: Socket) => {
    console.log(` New client connected: ${socket.id}`);

    socket.on('joinUserRoom', (userId: string) => {
      socket.join(userId);
      console.log(` User ${userId} joined their personal notification room`);
    });

    socket.on('disconnect', () => {
      console.log(` Client disconnected: ${socket.id}`);
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