import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function loadOwnedDevice(id: string, farmerId: number) {
  const deviceId = Number(id);
  if (!Number.isInteger(deviceId)) return null;

  const device = await prisma.device.findUnique({ where: { id: deviceId } });
  if (!device || device.farmerId !== farmerId) return null;

  return device;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const device = await loadOwnedDevice(id, session.userId);

  if (!device) {
    return NextResponse.json({ error: "Device not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));

  if (typeof body.active !== "boolean") {
    return NextResponse.json(
      { error: "active must be true or false." },
      { status: 400 }
    );
  }

  const updated = await prisma.device.update({
    where: { id: device.id },
    data: { active: body.active },
  });

  return NextResponse.json({ success: true, device: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const device = await loadOwnedDevice(id, session.userId);

  if (!device) {
    return NextResponse.json({ error: "Device not found." }, { status: 404 });
  }

  await prisma.device.delete({ where: { id: device.id } });

  return NextResponse.json({ success: true });
}
