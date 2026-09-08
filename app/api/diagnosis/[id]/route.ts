import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "AGRONOMIST") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const diagnosisId = Number(id);

  if (!Number.isInteger(diagnosisId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const diagnosis = await prisma.diagnosis.findUnique({
    where: { id: diagnosisId },
  });

  if (!diagnosis) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (diagnosis.agronomistId !== null && diagnosis.agronomistId !== session.userId) {
    return NextResponse.json(
      { error: "This request is already being handled by someone else." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const response = typeof body.response === "string" ? body.response.trim() : "";

  if (!response) {
    return NextResponse.json(
      { error: "Please write a response before submitting." },
      { status: 400 }
    );
  }

  const updated = await prisma.diagnosis.update({
    where: { id: diagnosisId },
    data: { response, status: "ANSWERED", agronomistId: session.userId },
  });

  return NextResponse.json({ success: true, diagnosis: updated });
}
