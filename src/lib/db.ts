import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore we are using a cache for the connection to avoid spamming the pool
  prisma = global.prisma = global.prisma || new PrismaClient();
}

// @ts-ignore
prisma.sql = prisma.$queryRaw;
// @ts-ignore  for syntax highlighting, see: frigus02.vscode-sql-tagged-template-literals
export const sql = prisma.sql;

export default prisma as PrismaClient & { sql: any };
