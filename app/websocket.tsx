"use client";

import { createContext, useEffect, useState } from "react";

export const WsContext = createContext<WebSocket | null>(null);

type AddImage = (data: string) => void;
type SetCount = (count: number) => void;

export function WebSocketProvider({
  children,
  addImage,
  setCount,
}: {
  children: React.ReactNode;
  addImage: AddImage;
  setCount: SetCount;
}) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (ws == null) {
      const url =
        process.env.NODE_ENV == "production"
          ? "wss://doodley.borks.dev/ws"
          : "ws://192.168.0.20:56789";
      const socket = new WebSocket(url);
      socket.addEventListener("message", async (e) => {
        const payload = JSON.parse(e.data);
        console.log(payload);
        if (payload.type == "i") addImage(payload.data);
        if (payload.type == "c") setCount(payload.data);
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWs(socket);
    }

    return () => {
      ws?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <WsContext.Provider value={ws}>{children}</WsContext.Provider>;
}
