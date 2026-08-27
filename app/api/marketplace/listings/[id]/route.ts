import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

async function loadListing(id: string) {
  const listingId = Number(id);
  if (!Number.isInteger(listingId)) return null;

  return prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      farmer: {
        select: { name: true, region: true, town: true, phone: true },
      },
    },
  });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  return NextResponse.json({ listing });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (listing.farmerId !== session.userId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body = await request.json().catch(() => ({}));

  if (body.status !== "ACTIVE" && body.status !== "SOLD_OUT") {
    return NextResponse.json(
      { error: "status must be 'ACTIVE' or 'SOLD_OUT'." },
      { status: 400 }
    );
  }

  const updated = await prisma.listing.update({
    where: { id: listing.id },
    data: { status: body.status },
  });

  return NextResponse.json({ success: true, listing: updated });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const listing = await loadListing(id);

  if (!listing) {
    return NextResponse.json({ error: "Listing not found." }, { status: 404 });
  }

  if (listing.farmerId !== session.userId) {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  await prisma.listing.delete({ where: { id: listing.id } });

  return NextResponse.json({ success: true });
}
