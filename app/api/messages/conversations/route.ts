import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: session.userId }, { receiverId: session.userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, role: true } },
      receiver: { select: { id: true, name: true, role: true } },
    },
  });

  type Contact = { id: number; name: string; role: string };
  type Conversation = {
    contact: Contact;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
  };

  const byContact = new Map<number, Conversation>();

  for (const m of messages) {
    const isSender = m.senderId === session.userId;
    const contact: Contact = isSender
      ? { id: m.receiver.id, name: m.receiver.name, role: m.receiver.role }
      : { id: m.sender.id, name: m.sender.name, role: m.sender.role };

    const existing = byContact.get(contact.id);

    if (!existing) {
      byContact.set(contact.id, {
        contact,
        lastMessage: m.content,
        lastMessageAt: m.createdAt.toISOString(),
        unreadCount: !isSender && !m.read ? 1 : 0,
      });
    } else if (!isSender && !m.read) {
      existing.unreadCount += 1;
    }
  }

  const conversations = Array.from(byContact.values()).sort(
    (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );

  return NextResponse.json({ conversations });
}
