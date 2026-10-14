"use client";

import { useImmer } from "use-immer";
import { DrawableWidget } from "./drawableWidet";
import { WebSocketProvider } from "./websocket";
import Image from "next/image";

export default function Page() {
  const [images, setImages] = useImmer<string[]>([]);

  return (
    <WebSocketProvider
      addImage={(data: string) => {
        setImages((draft) => {
          draft.push(data);
        });
      }}
    >
      <div style={{ display: "flex", gap: "8px" }}>
        <DrawableWidget />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "2px",
            alignContent: "flex-start",
          }}
        >
          {images.map((img, idx) => {
            return (
              <Image
                style={{ border: "1px solid black" }}
                width={200}
                height={200}
                src={img}
                alt="piece from internet user"
                key={idx}
              ></Image>
            );
          })}
        </div>
      </div>
    </WebSocketProvider>
  );
}
