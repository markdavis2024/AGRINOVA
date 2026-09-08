import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { id } = await params;
  const consultationId = Number(id);

  if (!Number.isInteger(consultationId)) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id: consultationId },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const status = body.status;

  if (session.role === "FARMER") {
    if (consultation.farmerId !== session.userId) {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }
    if (status !== "CANCELLED") {
      return NextResponse.json(
        { error: "Farmers can only cancel a consultation." },
        { status: 400 }
      );
    }
  } else if (session.role === "AGRONOMIST") {
    if (
      consultation.agronomistId !== null &&
      consultation.agronomistId !== session.userId
    ) {
      return NextResponse.json(
        { error: "This consultation is already assigned to someone else." },
        { status: 403 }
      );
    }
    if (!["CONFIRMED", "COMPLETED", "CANCELLED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const updated = await prisma.consultation.update({
    where: { id: consultationId },
    data: {
      status,
      agronomistId:
        session.role === "AGRONOMIST" ? session.userId : consultation.agronomistId,
    },
  });

  return NextResponse.json({ success: true, consultation: updated });
}
