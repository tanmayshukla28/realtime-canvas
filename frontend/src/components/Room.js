import React, { useEffect } from "react";
import { socket } from "../socket";
import CanvasBoard from "./CanvasBoard";

const Room = () => {
  const roomId = window.location.pathname.split("/")[1] || "default";

  useEffect(() => {
    socket.emit("join-room", roomId);
  }, [roomId]);

  return (
    <div className="app-container">
      <div className="header">
        🚀 Collaborative Canvas — Room: {roomId}
      </div>

      <CanvasBoard roomId={roomId} />
    </div>
  );
};

export default Room;