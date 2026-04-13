import { Server as SocketIoServer } from "socket.io";
import Message from "./models/messageModel.js";

const setupSocket = (server) => {
  const io = new SocketIoServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      credentials: true,
    },
  });
  const userSocketMap = new Map();
  const disconnect = (socket) => {
    console.log(`User ${socket.id} disconnected`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);

        break;
      }
    }

  };
  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const receiverSocketId = userSocketMap.get(message.receiver);
    const createdMessage=await Message.create(message)

    const messageData= await Message.findById(createdMessage._id).populate("sender","id email firstName lastName image color").populate("receiver","id email firstName lastName image color");
    if(receiverSocketId){
        io.to(receiverSocketId).emit("receiveMessage", messageData);
    }
    if (senderSocketId) {
       io.to(senderSocketId).emit("receiveMessage", messageData);
    }
  };
  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
  
    } else {
      console.log("User ID not provided in handshake query");
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;
