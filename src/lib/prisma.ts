import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "../generated/prisma/client";
import { DATABASE_URL } from "@/config/config";

const adapter = new PrismaLibSql({
  url: DATABASE_URL ?? "",
});

const prisma = new PrismaClient({ adapter });

export { prisma };
