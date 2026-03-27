import React, { useRef, useState, useEffect } from "react";
import { socket } from "../socket";
import Toolbar from "./Toolbar";

const CanvasBoard = ({ roomId }) => {
  const canvasRef = useRef(null);

  const [drawing, setDrawing] = useState(false);
  const [tool, setTool] = useState("pen");

  const [shapes, setShapes] = useState([]);
  const [cursors, setCursors] = useState({});

  const undoStack = useRef([]);
  const redoStack = useRef([]);

  const userId = useRef(Math.random().toString(36).substr(2, 9));

  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);

  useEffect(() => {
    socket.on("draw", (shape) => {
      setShapes((prev) => [...prev, shape]);
    });

    socket.on("load-shapes", (data) => {
      setShapes(data);
    });

    socket.on("sync", (data) => {
      setShapes(data);
    });

    socket.on("cursor-move", ({ id, cursor }) => {
      setCursors((prev) => ({
        ...prev,
        [id]: cursor,
      }));
    });

    return () => {
      socket.off("draw");
      socket.off("sync");
      socket.off("cursor-move");
    };
  }, []);

  const drawGrid = (ctx) => {
    const gridSize = 50;

    ctx.strokeStyle = "#eee";
    ctx.lineWidth = 1;

    for (let x = -3000; x < 3000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, -3000);
      ctx.lineTo(x, 3000);
      ctx.stroke();
    }

    for (let y = -3000; y < 3000; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-3000, y);
      ctx.lineTo(3000, y);
      ctx.stroke();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.setTransform(scale, 0, 0, scale, offset.x, offset.y);
    ctx.clearRect(-5000, -5000, 10000, 10000);

    drawGrid(ctx);

    shapes.forEach((shape) => {
      ctx.strokeStyle = shape.color || "black";
      ctx.lineWidth = shape.strokeWidth || 2;
      ctx.lineCap = "round";

      if (shape.type === "pen") {
        ctx.beginPath();
        ctx.moveTo(shape.prevX, shape.prevY);
        ctx.lineTo(shape.x, shape.y);
        ctx.stroke();
      }

      if (shape.type === "rect") {
        ctx.strokeRect(shape.x, shape.y, 60, 60);
      }

      if (shape.type === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(shape.x, shape.y, 30, 20, 0, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  }, [shapes, offset, scale]);

  const handleMouseDown = (e) => {
    if (e.shiftKey) {
      setIsPanning(true);
    } else {
      setDrawing(true);
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
    setIsPanning(false);
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();

    const x = (e.clientX - rect.left - offset.x) / scale;
    const y = (e.clientY - rect.top - offset.y) / scale;

    socket.emit("cursor-move", {
      roomId,
      cursor: { x: e.clientX - rect.left, y: e.clientY - rect.top },
    });

    if (isPanning) {
      setOffset((prev) => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY,
      }));
      return;
    }

    if (!drawing) return;

    const shape = {
      type: tool,
      x,
      y,
      prevX: x - 1,
      prevY: y - 1,
      userId: userId.current,
      color,
      strokeWidth,
    };

    setShapes((prev) => [...prev, shape]);

    undoStack.current.push(shape);
    redoStack.current = [];

    socket.emit("draw", { roomId, shape });
  };

  const undo = () => {
    if (!undoStack.current.length) return;

    const last = undoStack.current.pop();
    redoStack.current.push(last);

    const updated = shapes.filter((s) => s !== last);
    setShapes(updated);

    socket.emit("sync", { roomId, shapes: updated });
  };

  const redo = () => {
    if (!redoStack.current.length) return;

    const shape = redoStack.current.pop();
    undoStack.current.push(shape);

    const updated = [...shapes, shape];
    setShapes(updated);

    socket.emit("sync", { roomId, shapes: updated });
  };

  const handleWheel = (e) => {
    e.preventDefault();
    setScale((prev) =>
      Math.min(Math.max(prev - e.deltaY * 0.001, 0.2), 3)
    );
  };

  return (
    <>
      <Toolbar
        tool={tool}
        setTool={setTool}
        undo={undo}
        redo={redo}
        color={color}
        setColor={setColor}
        strokeWidth={strokeWidth}
        setStrokeWidth={setStrokeWidth}
      />

      <div className="canvas-container">
        <canvas
          ref={canvasRef}
          width={2000}
          height={1200}
          style={{ cursor: isPanning ? "grab" : "crosshair" }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        />

        {Object.entries(cursors).map(([id, cursor]) => (
          <div
            key={id}
            style={{
              position: "absolute",
              left: cursor.x,
              top: cursor.y,
              pointerEvents: "none",
              background: "#4f46e5",
              color: "white",
              padding: "2px 6px",
              borderRadius: "6px",
              fontSize: "12px",
            }}
          >
            👤
          </div>
        ))}
      </div>
    </>
  );
};

export default CanvasBoard;