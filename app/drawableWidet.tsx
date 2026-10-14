import { ChangeEvent, useContext, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { ColorResult } from "@uiw/react-color";
import dynamic from "next/dynamic";
import { WsContext } from "./websocket";
const Sketch = dynamic(
  () => import("@uiw/react-color").then((lib) => lib.Sketch),
  {
    ssr: false,
  },
);

export function DrawableWidget() {
  const socket = useContext(WsContext);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [backgroundColor, setBackgroundColor] = useState("#00000000");
  const [strokeColor, setStrokeColor] = useState("#000000ff");
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [mode, setMode] = useState<"draw" | "erase">("draw");

  type changeEvent = ChangeEvent<HTMLInputElement, HTMLInputElement>;

  const changeBackgroundColor = (color: ColorResult) => {
    setBackgroundColor(color.hexa);
  };
  const changeStrokeColor = (color: ColorResult) => {
    setStrokeColor(color.hexa);
  };
  const changeStrokeWidth = (event: changeEvent) => {
    setStrokeWidth(Number.parseInt(event.target.value));
  };
  const setDrawMode = () => {
    canvasRef.current?.eraseMode(false);
    setMode("draw");
  };
  const setEraseMode = () => {
    canvasRef.current?.eraseMode(true);
    setMode("erase");
  };
  const clearCanvas = () => {
    canvasRef.current?.clearCanvas();
    setDrawMode();
  };
  const exportCanvas = async () => {
    const image = await canvasRef.current?.exportImage("png");
    socket?.send(image!);
  };

  return (
    <div style={{ flexShrink: "0" }}>
      <ReactSketchCanvas
        width="500px"
        height="500px"
        canvasColor={backgroundColor}
        strokeColor={strokeColor}
        strokeWidth={strokeWidth}
        eraserWidth={strokeWidth}
        ref={canvasRef}
      />
      <Sketch
        style={{ display: "inline-block" }}
        color={backgroundColor}
        onChange={(color) => {
          changeBackgroundColor(color);
        }}
      />
      <Sketch
        style={{ display: "inline-block" }}
        color={strokeColor}
        onChange={(color) => {
          changeStrokeColor(color);
        }}
      />
      <input
        type="number"
        min={1}
        max={20}
        value={strokeWidth}
        required
        onChange={(e) => {
          changeStrokeWidth(e);
        }}
      />
      <button
        type="button"
        onClick={() => {
          setDrawMode();
        }}
        aria-pressed={mode === "draw"}
      >
        Draw
      </button>
      <button
        type="button"
        onClick={() => {
          setEraseMode();
        }}
        aria-pressed={mode === "erase"}
      >
        Erase
      </button>
      <button
        type="button"
        onClick={() => {
          clearCanvas();
        }}
      >
        Clear
      </button>
      <button
        type="button"
        onClick={async () => {
          exportCanvas();
        }}
      >
        Export
      </button>
    </div>
  );
}
