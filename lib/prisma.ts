import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// Prisma ORM 7 removed the built-in query engine — every PrismaClient
// now needs an explicit driver adapter. This one talks to Postgres
// over the standard `pg` driver using the same DATABASE_URL as before.
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to your .env file, e.g. DATABASE_URL=postgresql://user:password@localhost:5432/agrinova"
  );
}

// Create a new Pool instance for Prisma adapter
const pool = new pg.Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}