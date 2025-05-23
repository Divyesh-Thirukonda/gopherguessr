"use server";

import { WebSocketServer } from "ws";

let wss = null;
let defaultpPort = process.env.PORT || 5521;

function initWebSocketServer(port = defaultpPort) {
  wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    console.log("Client connected");
    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });

  console.log(
    "\x1b[32m[ OK ]\x1b[0m Web socket service initialized on port:",
    port,
  );
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
