import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Role } from "@prisma/client";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") as Role | null;
  const search = searchParams.get("search") ?? undefined;

  const users = await prisma.user.findMany({
    where: {
      ...(role ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      region: true,
      town: true,
      verified: true,
      suspended: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ users });
}
