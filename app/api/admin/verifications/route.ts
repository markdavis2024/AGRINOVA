import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const pending = await prisma.user.findMany({
    where: { verified: false },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      region: true,
      town: true,
      createdAt: true,
      specialization: true,
      experience: true,
      institution: true,
      certificationUrl: true,
      position: true,
      organization: true,
      inviteCode: true,
      authLetterUrl: true,
    },
  });

  return NextResponse.json({ pending });
}
