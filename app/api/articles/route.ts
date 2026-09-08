import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "true";

  const articles = await prisma.article.findMany({
    where: mine ? { authorId: session.userId } : undefined,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return NextResponse.json({ articles });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "AGRONOMIST") {
    return NextResponse.json(
      { error: "Only agronomist accounts can publish articles." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const content = typeof body.content === "string" ? body.content.trim() : "";

  if (!title || !category || !content) {
    return NextResponse.json(
      { error: "Please fill in the title, category and content." },
      { status: 400 }
    );
  }

  const article = await prisma.article.create({
    data: { title, category, content, authorId: session.userId },
  });

  return NextResponse.json({ success: true, article }, { status: 201 });
}
