import http from "http";
import { app } from "./app.js";
import { Server } from 'socket.io';

import dotenv from "dotenv";
dotenv.config();

const server = http.createServer(app);
export const io = new Server(server,{
    cors : {
        origin : process.env.CLIENT_URL,
    }
});

let userSocketMap = {};
io.on('connection', (socket) => {
  const userId = socket.handshake.query.userId;
  if(!userId) return;
  userSocketMap[userId] = socket.id;
  io.emit("onlineUsers" , Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("onlineUsers" , Object.keys(userSocketMap));
  });
});

export const getSocketId = (userId) =>{
    return userSocketMap[userId];
}
const port = process.env.PORT || 8000; 

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});