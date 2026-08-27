import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { saveUpload, UploadError } from "@/lib/uploads";

export async function GET(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const mine = searchParams.get("mine") === "true";
  const category = searchParams.get("category") ?? undefined;
  const search = searchParams.get("search") ?? undefined;

  if (mine && session.role !== "FARMER") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const listings = await prisma.listing.findMany({
    where: {
      ...(mine ? { farmerId: session.userId } : { status: "ACTIVE" }),
      ...(category ? { category } : {}),
      ...(search
        ? { title: { contains: search, mode: "insensitive" } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      farmer: {
        select: { name: true, region: true, town: true, phone: true },
      },
    },
  });

  return NextResponse.json({ listings });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "FARMER") {
    return NextResponse.json(
      { error: "Only farmer accounts can create listings." },
      { status: 403 }
    );
  }

  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const category = formData.get("category");
    const description = formData.get("description");
    const priceRaw = formData.get("price");
    const unit = formData.get("unit");
    const quantity = formData.get("quantity");
    const image = formData.get("image");

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof category !== "string" ||
      !category.trim() ||
      typeof description !== "string" ||
      !description.trim() ||
      typeof priceRaw !== "string" ||
      typeof unit !== "string" ||
      !unit.trim() ||
      typeof quantity !== "string" ||
      !quantity.trim()
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const price = Number(priceRaw);

    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json(
        { error: "Please enter a valid price." },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (image instanceof File && image.size > 0) {
      try {
        imageUrl = await saveUpload(image, "listings");
      } catch (uploadError) {
        if (uploadError instanceof UploadError) {
          return NextResponse.json(
            { error: uploadError.message },
            { status: 400 }
          );
        }
        throw uploadError;
      }
    }

    const listing = await prisma.listing.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        price: Math.round(price),
        unit: unit.trim(),
        quantity: quantity.trim(),
        imageUrl,
        farmerId: session.userId,
      },
    });

    return NextResponse.json({ success: true, listing }, { status: 201 });
  } catch (error) {
    console.error("Create listing error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
