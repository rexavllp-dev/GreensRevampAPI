import { Server } from 'socket.io';
import http from 'http';

const createSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
    }
  });

  io.on("connection", (socket) => {
    console.log("user joined ", socket.id);

    socket.on("joinRoom", (data) => {
      console.log("join room");
      console.log(data);
      socket.join(data);
    });

    socket.on("endsession", () => {
      socket.disconnect();
      console.log("booom");
    });

    socket.on("disconnect", () => {
      // console.log("user disconnected", socket.id);
    });

    socket.on("sendMessage", ((data) => {
      console.log("send msg", data.email);
      io.to(data.email).emit("receiveMessage", data);
      console.log(data);
    }));
  });

  return io;
};

export default createSocketServer;