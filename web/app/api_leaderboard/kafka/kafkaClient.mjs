import {
  broadcastToClients,
  initWebSocketServer,
} from "../websockets/broadcast.mjs";
import fs from "fs";
import path from "path";
import { Kafka, logLevel } from "kafkajs";

// Save time on reconnecting to producer
let cachedProducer = null;
let cachedSubscriber = null;

// Read key-value config from Confluent-style .properties file
function readConfig(fileName) {
  const fullPath = path.join(process.cwd(), fileName);
  const lines = fs.readFileSync(fullPath, "utf8").split("\n");

  return lines.reduce((config, line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return config;
    const [key, value] = trimmed.split("=");
    if (key && value) {
      config[key.trim()] = value.trim();
    }
    return config;
  }, {});
}

async function establishProducerClient(rawConfig) {
  if (cachedProducer == null) {
    const kafka = new Kafka({
      clientId: rawConfig["client.id"],
      logLevel: logLevel.NOTHING,
      brokers: [rawConfig["bootstrap.servers"]],
      ssl: true,
      sasl: {
        mechanism: rawConfig["sasl.mechanisms"].toLowerCase(),
        username: rawConfig["sasl.username"],
        password: rawConfig["sasl.password"],
      },
    });

    const producer = kafka.producer();
    await producer.connect();
    cachedProducer = producer;
    console.log("Producer cache miss. New producer created.");
  } else {
    console.log("Producer cache hit!");
  }
}

async function establishSubscriberClient(rawConfig) {
  if (cachedSubscriber == null) {
    const kafka = new Kafka({
      clientId: rawConfig["client.id"],
      logLevel: logLevel.NOTHING,
      brokers: [rawConfig["bootstrap.servers"]],
      ssl: true,
      sasl: {
        mechanism: rawConfig["sasl.mechanisms"].toLowerCase(),
        username: rawConfig["sasl.username"],
        password: rawConfig["sasl.password"],
      },
    });

    const consumer = kafka.consumer({ groupId: "nodejs-group-1" });
    await consumer.connect();
    await consumer.subscribe({
      topic: "multiplayer_guesses",
      fromBeginning: true,
    });

    cachedSubscriber = consumer;

    // Cleanup on signals
    const disconnect = async () => {
      try {
        await cachedSubscriber.disconnect();
      } catch (err) {
        console.error("Error during disconnect:", err);
      }
      process.exit(0);
    };
    process.on("SIGTERM", disconnect);
    process.on("SIGINT", disconnect);

    console.log("Subscriber cache miss. New subscriber created.");
  } else {
    console.log("Subscriber cache hit!");
  }
}

// Kafka producer for multiplayer guess
async function publishMultiplayerGuess(
  topic,
  lobbyId,
  lobbyUsername,
  currentPoints,
) {
  const rawConfig = readConfig("client.properties");
  await establishProducerClient(rawConfig);
  const value = JSON.stringify({
    lobbyUsername: lobbyUsername,
    points: currentPoints,
  });

  let key = lobbyId.toString();

  // Post to log
  await cachedProducer.send({
    topic,
    messages: [{ key, value }],
  });

  console.log(`Produced message to ${topic}.`);
}

// Kafka subscriber to multiplayer guesses
async function subscribeToMultiplayerGuesses(rawConfig) {
  await establishSubscriberClient(rawConfig);
  initWebSocketServer();

  if (cachedSubscriber != null) {
    cachedSubscriber.run({
      eachMessage: async ({ topic, message }) => {
        const parsed = JSON.parse(message.value.toString());
        broadcastToClients({ type: "NEW_GUESS", data: parsed });
      },
    });
  }
}

async function startKafkaService() {
  // Set up Kafkas client
  const config = readConfig("client.properties");
  await subscribeToMultiplayerGuesses(config);
  console.log(
    "\x1b[32m[ OK ]\x1b[0m Kafka service initialized for leaderboards",
  );
}

export { startKafkaService, publishMultiplayerGuess };
