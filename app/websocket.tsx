"use client";

import { createContext, useEffect, useState } from "react";

export const WsContext = createContext<WebSocket | null>(null);

type AddImage = (data: string) => void;

export function WebSocketProvider({
  children,
  addImage,
}: {
  children: React.ReactNode;
  addImage: AddImage;
}) {
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    if (ws == null) {
      const socket = new WebSocket("wss://doodley.borks.dev/ws");
      socket.addEventListener("message", async (e) => {
        addImage(await (e.data as Blob).text());
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
