import { PrismaClient } from "@prisma/client";

let db;

if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    global.prisma.$connect();
  }
  db = global.prisma;
}

export default db;
