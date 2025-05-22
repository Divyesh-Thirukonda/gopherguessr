import { WebSocketServer } from "ws";

let wss = null;

function initWebSocketServer(port = 8080) {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.send(JSON.stringify({ message: "Hello!" }));
    ws.on("close", () => {
      console.log("Disconnected");
    });
  });

  console.log("[ OK ] WebSocket server running on port", port);
}

function broadcastToClients(message) {
  if (!wss) return;
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(message));
    }
  });
}

export { initWebSocketServer, broadcastToClients };
