import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore we are using a cache for the connection to avoid spamming the pool
  prisma = global.prisma = global.prisma || new PrismaClient();
}

export default prisma;
