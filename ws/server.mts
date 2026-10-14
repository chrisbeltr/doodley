import { WebSocketServer, WebSocket } from "ws";

process.on("SIGTERM", function () {
  console.log("SIGTERM received, shutting down...");
  process.exit(0);
});
process.on("SIGINT", function () {
  console.log("SIGINT received, shutting down...");
  process.exit(0);
});

interface CustomWebSocket extends WebSocket {
  isAlive?: boolean;
}

const port =
  process.env.NODE_ENV == "production"
    ? Number.parseInt(process.env["WS_PORT"]!)
    : 8601;

let connections = 0;

const wss = new WebSocketServer({
  port: port,
  perMessageDeflate: false,
});

function sendData(payload: object) {
  for (const client of wss.clients) {
    if (client.readyState == client.OPEN) {
      client.send(JSON.stringify(payload));
    }
  }
}
function sendImage(image: string) {
  sendData({ type: "i", data: image });
}
function sendConnectionCount(count: number) {
  sendData({ type: "c", data: count });
}

wss.on("connection", (ws: CustomWebSocket) => {
  connections++;
  sendConnectionCount(connections);
  ws.isAlive = true;
  ws.on("pong", () => {
    ws.isAlive = true;
  });

  ws.on("message", (data) => {
    const payload = JSON.parse(data.toString("utf-8"));
    if (payload.type == "p") ws.send(JSON.stringify({ type: "p", data: null }));
    if (payload.type == "i") sendImage(payload.data);
  });

  ws.on("close", () => {
    ws.terminate();
    connections--;
    sendConnectionCount(connections);
  });
});

setInterval(() => {
  wss.clients.forEach((ws: CustomWebSocket) => {
    if (ws.isAlive == false) {
      sendConnectionCount(connections);
      return ws.terminate();
    }

    ws.isAlive = false;
    ws.ping();
  });
}, 5000);

console.log(`websocket listening on port ${port}`);
