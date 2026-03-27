const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    if (!rooms[roomId]) rooms[roomId] = [];

    socket.emit("load-shapes", rooms[roomId]);
  });

  socket.on("draw", ({ roomId, shape }) => {
    if (!rooms[roomId]) rooms[roomId] = [];

    rooms[roomId].push(shape);
    socket.to(roomId).emit("draw", shape);
  });

  socket.on("sync", ({ roomId, shapes }) => {
    rooms[roomId] = shapes;
    socket.to(roomId).emit("sync", shapes);
  });

  socket.on("cursor-move", ({ roomId, cursor }) => {
    socket.to(roomId).emit("cursor-move", {
      id: socket.id,
      cursor,
    });
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});