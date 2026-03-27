const rooms = {};

const getRoom = (roomId) => {
  if (!rooms[roomId]) {
    rooms[roomId] = [];
  }
  return rooms[roomId];
};

const addShape = (roomId, shape) => {
  rooms[roomId].push(shape);
};

module.exports = { getRoom, addShape };