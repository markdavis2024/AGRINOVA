import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const as = searchParams.get("as"); // "buyer" | "farmer"

  if (as === "buyer") {
    if (session.role !== "BUYER") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: { buyerId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: {
          select: {
            title: true,
            unit: true,
            imageUrl: true,
            farmer: { select: { id: true, name: true, phone: true } },
          },
        },
      },
    });

    return NextResponse.json({ orders });
  }

  if (as === "farmer") {
    if (session.role !== "FARMER") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
      where: { listing: { farmerId: session.userId } },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { select: { title: true, unit: true, imageUrl: true } },
        buyer: { select: { name: true, phone: true, town: true, region: true } },
      },
    });

    return NextResponse.json({ orders });
  }

  return NextResponse.json(
    { error: "Pass ?as=buyer or ?as=farmer." },
    { status: 400 }
  );
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "BUYER") {
    return NextResponse.json(
      { error: "Only buyer accounts can place orders." },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const listingId = Number(body.listingId);
  const quantity = Number(body.quantity);
  const note = typeof body.note === "string" ? body.note.trim() : undefined;

  if (!Number.isInteger(listingId) || !Number.isInteger(quantity) || quantity <= 0) {
    return NextResponse.json(
      { error: "Please provide a valid listing and quantity." },
      { status: 400 }
    );
  }

  const listing = await prisma.listing.findUnique({ where: { id: listingId } });

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (listing.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "This listing is no longer available." },
      { status: 400 }
    );
  }

  const order = await prisma.order.create({
    data: {
      listingId,
      buyerId: session.userId,
      quantity,
      totalPrice: listing.price * quantity,
      note,
    },
  });

  return NextResponse.json({ success: true, order }, { status: 201 });
}
