"use client";

import { useImmer } from "use-immer";
import { DrawableWidget } from "./drawableWidet";
import { WebSocketProvider } from "./websocket";
import Image from "next/image";
import { useState } from "react";
import { Kranky } from "next/font/google";

const kranky = Kranky({ weight: "400", subsets: ["latin"] });

export default function Page() {
  const [images, setImages] = useImmer<string[]>([]);
  const [count, setCount] = useState<number>(0);
  const [status, setStatus] = useState<string>("disconnected");

  return (
    <WebSocketProvider
      addImage={(data: string) => {
        setImages((draft) => {
          draft.unshift(data);
        });
      }}
      setCount={(count: number) => {
        setCount(count);
      }}
      setStatus={setStatus}
    >
      <div className="container">
        <div className="container-left">
          <div className={`app-name ${kranky.className}`}>doodley</div>
          <DrawableWidget />
          <div className="server-stats">
            <span>Users Connected: {count}</span>
            <span>Status: {status}</span>
          </div>
        </div>
        <div className="middle-bar"></div>
        <div className="container-right">
          {images.map((img, idx) => {
            return (
              <Image
                className="drawing"
                width={1}
                height={1}
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
