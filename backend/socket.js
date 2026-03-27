const { Server } = require("socket.io");
const { getRoom, addShape } = require("./rooms");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", (roomId) => {
      socket.join(roomId);

      // send existing data
      const shapes = getRoom(roomId);
      socket.emit("load-shapes", shapes);
    });

    socket.on("draw", ({ roomId, shape }) => {
      addShape(roomId, shape);
      socket.to(roomId).emit("draw", shape);
    });
  });
};

module.exports = { initSocket };