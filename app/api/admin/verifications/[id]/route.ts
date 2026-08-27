import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ActionBody = {
  action?: "approve" | "reject";
};

export async function POST(
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

  const body: ActionBody = await request.json().catch(() => ({}));

  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json(
      { error: "action must be 'approve' or 'reject'." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user || user.verified) {
    return NextResponse.json(
      { error: "No pending account found with that id." },
      { status: 404 }
    );
  }

  if (body.action === "approve") {
    await prisma.user.update({
      where: { id: userId },
      data: { verified: true },
    });

    return NextResponse.json({ success: true, status: "approved" });
  }

  // Reject: the account is removed and the person needs to re-register.
  await prisma.user.delete({ where: { id: userId } });

  return NextResponse.json({ success: true, status: "rejected" });
}
