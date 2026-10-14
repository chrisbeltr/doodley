import { WebSocketServer, WebSocket } from "ws";

interface CustomWebSocket extends WebSocket {
  isAlive?: boolean;
}

const port =
  process.env.NODE_ENV == "production"
    ? Number.parseInt(process.env["WS_PORT"]!)
    : 56789;

const wss = new WebSocketServer({
  port: port,
});

wss.on("connection", (ws: CustomWebSocket) => {
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data: string) => {
    for (const client of wss.clients) {
      if (client.readyState == client.OPEN) {
        client.send(data);
      }
    }
  });
});

setInterval(() => {
  wss.clients.forEach((ws: CustomWebSocket) => {
    if (ws.isAlive == false) return ws.terminate();

    ws.isAlive = false;
    ws.ping();
  });
}, 60000);

console.log(`websocket listening on port ${port}`);
