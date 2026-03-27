import React from "react";

const Toolbar = ({
  tool,
  setTool,
  undo,
  redo,
  color,
  setColor,
  strokeWidth,
  setStrokeWidth,
}) => {
  return (
    <div className="toolbar">
      <button
        className={`tool-btn ${tool === "pen" ? "active" : ""}`}
        onClick={() => setTool("pen")}
      >
        ✏️
      </button>

      <button
        className={`tool-btn ${tool === "rect" ? "active" : ""}`}
        onClick={() => setTool("rect")}
      >
        ⬛
      </button>

      <button
        className={`tool-btn ${tool === "ellipse" ? "active" : ""}`}
        onClick={() => setTool("ellipse")}
      >
        ⚪
      </button>

      <button className="tool-btn" onClick={undo}>↩</button>
      <button className="tool-btn" onClick={redo}>↪</button>

      <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />

      <input
        type="range"
        min="1"
        max="10"
        value={strokeWidth}
        onChange={(e) => setStrokeWidth(e.target.value)}
      />
    </div>
  );
};

export default Toolbar;