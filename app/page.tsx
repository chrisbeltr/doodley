"use client";

import { useImmer } from "use-immer";
import { DrawableWidget } from "./drawableWidet";
import { WebSocketProvider } from "./websocket";
import Image from "next/image";
import { useState } from "react";

export default function Page() {
  const [images, setImages] = useImmer<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<string>("disconnected");

  return (
    <WebSocketProvider
      addImage={(data: string) => {
        setImages((draft) => {
          draft.push(data);
        });
      }}
      setCount={(count: number) => {
        setCount(count);
      }}
      setStatus={setStatus}
    >
      <div style={{ display: "flex", gap: "8px" }}>
        <div style={{ flexShrink: 0 }}>
          <span>Users Connected: {count}</span>
          <span>Status: {status}</span>
          <DrawableWidget />
        </div>
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
