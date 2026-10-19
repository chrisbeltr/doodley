import { ChangeEvent, useContext, useRef, useState } from "react";
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { WsContext } from "./websocket";
import { Picker } from "./picker";

export function DrawableWidget() {
  const socket = useContext(WsContext);
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [backgroundColor, setBackgroundColor] = useState("#ffffffff");
  const [foregroundColor, setForegroundColor] = useState("#000000ff");
  const [cursorWidth, setCursorWidth] = useState(8);
  const [mode, setMode] = useState<"draw" | "erase">("draw");

  type changeEvent = ChangeEvent<HTMLInputElement, HTMLInputElement>;

  const changeBackgroundColor = (color: string) => {
    setBackgroundColor(color);
  };
  const changeForegroundColor = (color: string) => {
    setForegroundColor(color);
  };
  const changeCursorWidth = (event: changeEvent) => {
    setCursorWidth(Number.parseInt(event.target.value));
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
  const undoCanvas = () => {
    canvasRef.current?.undo();
  };
  const redoCanvas = () => {
    canvasRef.current?.redo();
  };
  const exportCanvas = async () => {
    const image = await canvasRef.current?.exportImage("png");
    socket?.send(JSON.stringify({ type: "i", data: image! }));
  };

  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const [visibility, setVisibility] = useState(false);
  return (
    <div className="drawable-container">
      <div className="tools-container">
        <Picker
          label="bg color"
          color={backgroundColor}
          onChange={changeBackgroundColor}
        ></Picker>
        <Picker
          label="fg color"
          color={foregroundColor}
          onChange={changeForegroundColor}
        ></Picker>
        <div className="cursor-width-input">
          <span>cursor width</span>
          <input
            type="number"
            min={1}
            max={20}
            value={cursorWidth}
            required
            onChange={(e) => {
              changeCursorWidth(e);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setDrawMode();
          }}
          disabled={mode === "draw"}
          aria-pressed={mode === "draw"}
        >
          Draw
        </button>
        <button
          type="button"
          onClick={() => {
            setEraseMode();
          }}
          disabled={mode === "erase"}
          aria-pressed={mode === "erase"}
        >
          Erase
        </button>
        <button
          type="button"
          onClick={() => {
            undoCanvas();
          }}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => {
            redoCanvas();
          }}
        >
          Redo
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
      <div
        className="canvas-container"
        onPointerMove={(ev) => {
          setMx(ev.clientX);
          setMy(ev.clientY);
        }}
        onPointerEnter={() => setVisibility(true)}
        onPointerLeave={() => setVisibility(false)}
      >
        <div
          className="canvas-cursor"
          style={{
            width: cursorWidth,
            height: cursorWidth,
            top: my - cursorWidth / 2,
            left: mx - cursorWidth / 2,
            visibility: visibility ? "visible" : "hidden",
          }}
        ></div>
        <ReactSketchCanvas
          className="canvas"
          canvasColor={backgroundColor}
          strokeColor={foregroundColor}
          strokeWidth={cursorWidth}
          eraserWidth={cursorWidth}
          ref={canvasRef}
        />
      </div>
    </div>
  );
}
