import * as PrismaModule from "@prisma/client";

const PrismaClient = (PrismaModule as unknown as {
  PrismaClient: new (options?: {
    log?: Array<"error" | "warn" | "info" | "query">;
  }) => object;
}).PrismaClient;
type PrismaClient = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;