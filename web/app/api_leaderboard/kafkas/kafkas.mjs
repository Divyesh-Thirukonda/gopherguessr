"use server";

import { broadcastToClients } from "../websockets/server.mjs";
import fs from "fs";
import path from "path";
import { Kafka, logLevel } from "kafkajs";

// Save time on reconnecting to publisher
let cachedKafka = null;
let cachedPublisher = null;

// Read key-value config from .properties file
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

// Create new kafka client or return cached client
function getKafkaClient(rawConfig) {
  if (cachedKafka != null) {
    console.log("Kafka client cache hit!");
    return cachedKafka;
  }

  const kafka = new Kafka({
    clientId: rawConfig["client.id"],
    logLevel: logLevel.NOTHING, // May change this, logs got annoying
    brokers: [rawConfig["bootstrap.servers"]],
    ssl: true,
    sasl: {
      mechanism: rawConfig["sasl.mechanisms"].toLowerCase(),
      username: rawConfig["sasl.username"],
      password: rawConfig["sasl.password"],
    },
  });

  cachedKafka = kafka;
  return cachedKafka;
}

// Connect publisher to kafkas service
async function connectPublisher(rawConfig) {
  if (cachedPublisher) {
    // Already connected
    return;
  }

  const kafka = getKafkaClient(rawConfig);
  const publisher = kafka.producer();
  await publisher.connect();
  cachedPublisher = publisher;
}

// Connect subscriber to kafkas service
async function connectSubscriber(rawConfig, topic, fromBeginning = true) {
  const kafka = getKafkaClient(rawConfig);

  const subscriber = kafka.consumer({
    groupId: rawConfig["group.id"] || "default-consumers",
  });
  await subscriber.connect();
  await subscriber.subscribe({
    topic: topic,
    fromBeginning: fromBeginning,
  });

  // Cleanup on signals
  const disconnect = async () => {
    try {
      await subscriber.disconnect();
    } catch (err) {
      console.error("Error during disconnect:", err);
    }
    process.exit(0);
  };

  process.on("SIGTERM", disconnect);
  process.on("SIGINT", disconnect);

  return subscriber;
}

// Publish message to specified kafkas topic
async function publishMessage(topic, key, value) {
  const rawConfig = readConfig("client.properties");
  await connectPublisher(rawConfig);

  // Post to log
  try {
    await cachedPublisher.send({
      topic,
      messages: [{ key, value }],
    });
  } catch (err) {
    console.log(`Failed to publish message to ${topic}.`);
  }

  console.log(`Published message to ${topic}.`);
}

// Subscribe to multiplayer guesses
async function subscribeToMultiplayerGuesses(rawConfig) {
  const subscriber = await connectSubscriber(
    rawConfig,
    "multiplayer_guesses",
    true,
  ); // No need to cache this, it only happens when the service is initialized

  if (subscriber != null) {
    subscriber.run({
      eachMessage: async ({ topic, message }) => {
        const parsed = JSON.parse(message.value.toString());
        broadcastToClients({ type: "NEW_GUESS", data: parsed });
      },
    });
  }
}

// Initialize constant subscribers and other long running processes
async function startKafkaService() {
  // Set up Kafkas client
  const config = readConfig("client.properties");
  await subscribeToMultiplayerGuesses(config);

  // Success
  console.log(
    "\x1b[32m[ OK ]\x1b[0m Kafka service initialized for leaderboards",
  );
}

export { startKafkaService, publishMessage };
