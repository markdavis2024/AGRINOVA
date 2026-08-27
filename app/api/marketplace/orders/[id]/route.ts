import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const FARMER_ALLOWED = new Set(["CONFIRMED", "DELIVERED", "CANCELLED"]);
const BUYER_ALLOWED = new Set(["CANCELLED"]);

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { id } = await params;
  const orderId = Number(id);

  if (!Number.isInteger(orderId)) {
    return NextResponse.json({ error: "Invalid order id." }, { status: 400 });
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { listing: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const body = await request.json().catch(() => ({}));
  const status = body.status;

  const isFarmer =
    session.role === "FARMER" && order.listing.farmerId === session.userId;
  const isBuyer = session.role === "BUYER" && order.buyerId === session.userId;

  if (isFarmer) {
    if (!FARMER_ALLOWED.has(status)) {
      return NextResponse.json(
        { error: "status must be CONFIRMED, DELIVERED or CANCELLED." },
        { status: 400 }
      );
    }
  } else if (isBuyer) {
    if (!BUYER_ALLOWED.has(status) || order.status !== "PENDING") {
      return NextResponse.json(
        { error: "You can only cancel an order while it's still pending." },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status },
  });

  return NextResponse.json({ success: true, order: updated });
}
