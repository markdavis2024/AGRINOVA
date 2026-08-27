import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import type { Role } from "@prisma/client";

const VALID_ROLES: Role[] = ["FARMER", "BUYER", "AGRONOMIST", "ADMIN"];

type ActionBody = {
  role?: Role;
  suspended?: boolean;
  verified?: boolean;
};

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  if (userId === session.userId) {
    return NextResponse.json(
      { error: "You can't change your own account this way." },
      { status: 400 }
    );
  }

  const body: ActionBody = await request.json().catch(() => ({}));
  const data: ActionBody = {};

  if (body.role !== undefined) {
    if (!VALID_ROLES.includes(body.role)) {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }
    data.role = body.role;
  }

  if (body.suspended !== undefined) data.suspended = Boolean(body.suspended);
  if (body.verified !== undefined) data.verified = Boolean(body.verified);

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "Nothing to update." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      verified: true,
      suspended: true,
    },
  });

  return NextResponse.json({ success: true, user: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const userId = Number(id);

  if (!Number.isInteger(userId)) {
    return NextResponse.json({ error: "Invalid user id." }, { status: 400 });
  }

  if (userId === session.userId) {
    return NextResponse.json(
      { error: "You can't delete your own account." },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });

  if (!existing) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true });
}
