import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { DeviceType } from "@prisma/client";

const VALID_TYPES: DeviceType[] = [
  "SOIL_MOISTURE",
  "WEATHER_STATION",
  "TEMPERATURE_HUMIDITY",
  "WATER_LEVEL",
  "OTHER",
];

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const devices = await prisma.device.findMany({
    where: { farmerId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ devices });
}

type CreateBody = {
  name?: string;
  type?: string;
  location?: string;
};

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body: CreateBody = await request.json().catch(() => ({}));

  if (!body.name || !body.name.trim()) {
    return NextResponse.json(
      { error: "Please give the device a name." },
      { status: 400 }
    );
  }

  if (!body.type || !VALID_TYPES.includes(body.type as DeviceType)) {
    return NextResponse.json(
      { error: "Please choose a valid device type." },
      { status: 400 }
    );
  }

  const device = await prisma.device.create({
    data: {
      name: body.name.trim(),
      type: body.type as DeviceType,
      location: body.location?.trim() || undefined,
      farmerId: session.userId,
    },
  });

  return NextResponse.json({ success: true, device }, { status: 201 });
}
