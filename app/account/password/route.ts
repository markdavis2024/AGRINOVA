import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { hashPassword, verifyPassword } from "@/lib/passwords";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const currentPassword =
    typeof body.currentPassword === "string" ? body.currentPassword : "";
  const newPassword =
    typeof body.newPassword === "string" ? body.newPassword : "";

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Please fill in both password fields." },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "Your new password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const matches = await verifyPassword(currentPassword, user.password);

  if (!matches) {
    return NextResponse.json(
      { error: "Your current password is incorrect." },
      { status: 401 }
    );
  }

  const passwordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: session.userId },
    data: { password: passwordHash },
  });

  return NextResponse.json({ success: true });
}
