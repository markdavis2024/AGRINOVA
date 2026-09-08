import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "AGRONOMIST") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const articleId = Number(id);

  if (!Number.isInteger(articleId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const article = await prisma.article.findUnique({ where: { id: articleId } });

  if (!article) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (article.authorId !== session.userId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.article.delete({ where: { id: articleId } });

  return NextResponse.json({ success: true });
}
