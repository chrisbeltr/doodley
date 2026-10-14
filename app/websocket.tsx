"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";

export const WsContext = createContext<WebsocketClient | null>(null);

type AddImage = (data: string) => void;
type SetCount = (count: number) => void;
export interface WebsocketClient extends WebSocket {
  alive: boolean;
}

export function WebSocketProvider({
  children,
  addImage,
  setCount,
  setStatus,
}: {
  children: React.ReactNode;
  addImage: AddImage;
  setCount: SetCount;
  setStatus: Dispatch<SetStateAction<string>>;
}) {
  const [ws, setWs] = useState<WebsocketClient | null>(null);

  useEffect(() => {
    function openWebsocket() {
      const url =
        process.env.NODE_ENV == "production"
          ? "wss://doodley.borks.dev/ws"
          : "ws://192.168.0.20:8601";
      const socket = new WebSocket(url) as WebsocketClient;
      const ping = setInterval(() => {
        if (socket && !socket.alive) {
          setStatus("disconnected");
          clearInterval(ping);
          ws?.close();
          openWebsocket();
          return;
        }
        socket.alive = false;
        socket.send(JSON.stringify({ type: "p", data: null }));
      }, 1000);
      socket.addEventListener("open", () => {
        setStatus("connected");
        socket.alive = true;
      });
      socket.addEventListener("message", async (e) => {
        const payload = JSON.parse(e.data);
        if (payload.type == "i") addImage(payload.data);
        if (payload.type == "c") setCount(payload.data);
        if (payload.type == "p") socket.alive = true;
      });
      setWs(socket);
      return socket;
    }
    let socket: WebsocketClient | null = null;

    if (ws == null) {
      socket = openWebsocket();
    }

    return () => {
      socket?.close();
      setWs(null);
    };
  }, []);

  return <WsContext.Provider value={ws}>{children}</WsContext.Provider>;
}
