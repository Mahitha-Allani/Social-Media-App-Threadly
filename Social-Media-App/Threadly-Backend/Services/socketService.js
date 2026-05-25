import { Server } from "socket.io";

let io;
const userSocketMap = {}; // userId (string) -> socketId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: (origin, callback) => {
        const allowed = [
          process.env.CLIENT_URL,
          'http://localhost:5173',
          'http://localhost:3000',
        ];
        if (!origin || allowed.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected to Socket.io:", socket.id);

    // Register active user connection
    socket.on("register_user", (userId) => {
      if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`Socket.io registered user: ${userId} -> socketId: ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket.io user disconnected:", socket.id);
      // Remove from map
      for (const [userId, socketId] of Object.entries(userSocketMap)) {
        if (socketId === socket.id) {
          delete userSocketMap[userId];
          console.log(`Socket.io unregistered user: ${userId}`);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

export const sendNotification = (receiverId, notificationData) => {
  if (!receiverId) return;
  const socketId = userSocketMap[receiverId.toString()];
  if (socketId && io) {
    io.to(socketId).emit("new_notification", notificationData);
    console.log(`Real-time notification emitted via Socket.io to user: ${receiverId}`);
  } else {
    console.log(`Real-time notification skipped, user ${receiverId} not connected.`);
  }
};
