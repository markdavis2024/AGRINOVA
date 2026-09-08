import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function loadOwnedFarm(id: string, userId: number) {
  const farmId = Number(id);
  if (!Number.isInteger(farmId)) return { error: "Invalid id.", status: 400 } as const;

  const farm = await prisma.farm.findUnique({ where: { id: farmId } });

  if (!farm) return { error: "Farm not found.", status: 404 } as const;
  if (farm.farmerId !== userId) return { error: "Not authorized.", status: 403 } as const;

  return { farm } as const;
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
  const result = await loadOwnedFarm(id, session.userId);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
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

  const updated = await prisma.farm.update({
    where: { id: result.farm.id },
    data: {
      name,
      farmingType,
      size: body.size || null,
      region: body.region || null,
      town: body.town || null,
      description: body.description || null,
    },
  });

  return NextResponse.json({ success: true, farm: updated });
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
  const result = await loadOwnedFarm(id, session.userId);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  await prisma.farm.delete({ where: { id: result.farm.id } });

  return NextResponse.json({ success: true });
}
