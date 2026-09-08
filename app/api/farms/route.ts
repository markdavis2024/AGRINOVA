import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const farms = await prisma.farm.findMany({
    where: { farmerId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ farms });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json(
      { error: "Only farmer accounts can add farms." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const farmingType = typeof body.farmingType === "string" ? body.farmingType.trim() : "";

  if (!name || !farmingType) {
    return NextResponse.json(
      { error: "Please give the farm a name and a farming type." },
      { status: 400 }
    );
  }

  const farm = await prisma.farm.create({
    data: {
      name,
      farmingType,
      size: body.size || null,
      region: body.region || null,
      town: body.town || null,
      description: body.description || null,
      farmerId: session.userId,
    },
  });

  return NextResponse.json({ success: true, farm }, { status: 201 });
}
