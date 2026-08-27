import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const withId = Number(searchParams.get("with"));

  if (!Number.isInteger(withId)) {
    return NextResponse.json(
      { error: "Missing or invalid 'with' user id." },
      { status: 400 }
    );
  }

  const other = await prisma.user.findUnique({
    where: { id: withId },
    select: { id: true, name: true, role: true },
  });

  if (!other) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: session.userId, receiverId: withId },
        { senderId: withId, receiverId: session.userId },
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  // Mark any messages they sent us as read now that we've opened the thread.
  await prisma.message.updateMany({
    where: { senderId: withId, receiverId: session.userId, read: false },
    data: { read: true },
  });

  return NextResponse.json({ messages, contact: other });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const receiverId = Number(body.receiverId);
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!Number.isInteger(receiverId)) {
    return NextResponse.json(
      { error: "Missing or invalid receiverId." },
      { status: 400 }
    );
  }

  if (!content) {
    return NextResponse.json(
      { error: "Message can't be empty." },
      { status: 400 }
    );
  }

  if (receiverId === session.userId) {
    return NextResponse.json(
      { error: "You can't message yourself." },
      { status: 400 }
    );
  }

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

  if (!receiver) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const message = await prisma.message.create({
    data: {
      content,
      senderId: session.userId,
      receiverId,
    },
  });

  return NextResponse.json({ success: true, message }, { status: 201 });
}
