"use server";

// Driver for kafkas service and websocket server
// (Not a Next.js "api" route, microservice outside of app's scope)

import { initWebSocketServer } from "./websockets/server.js";
import { startKafkaService } from "./kafkas/kafkas.js";

initWebSocketServer();
startKafkaService();
