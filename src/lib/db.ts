import { PrismaClient } from "@prisma/client";
import chalk from "chalk";

const options = {
  log: [
    {
      emit: "event" as any,
      level: "query" as any,
    },
  ],
};

function logQuery(e) {
  console.log(
    chalk.yellow(e.params),
    "->",
    e.query,
    chalk.greenBright(`${e.duration}ms`)
  );
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(options);
  prisma.$on("query" as any, logQuery);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(options);
    global.prisma.$on("query", logQuery);
  }

  prisma = global.prisma;
}

export default prisma;
