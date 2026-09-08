import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      region: true,
      town: true,
      farmingType: true,
      farmSize: true,
      twoFactor: true,
      iotInterest: true,
      interests: true,
      specialization: true,
      experience: true,
      institution: true,
      position: true,
      organization: true,
      verified: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json({ user });
}

type UpdateBody = {
  name?: string;
  email?: string;
  phone?: string;
  region?: string;
  town?: string;
  farmingType?: string;
  farmSize?: string;
  twoFactor?: boolean;
  iotInterest?: boolean;
  interests?: string[];
  specialization?: string;
  experience?: string;
  institution?: string;
  position?: string;
  organization?: string;
};

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ error: "Please sign in." }, { status: 401 });
  }

  const body: UpdateBody = await request.json().catch(() => ({}));

  if (!body.name || !body.email || !body.phone) {
    return NextResponse.json(
      { error: "Name, email and phone are required." },
      { status: 400 }
    );
  }

  if (body.email !== undefined) {
    const existing = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existing && existing.id !== session.userId) {
      return NextResponse.json(
        { error: "That email is already in use by another account." },
        { status: 409 }
      );
    }
  }

  const updated = await prisma.user.update({
    where: { id: session.userId },
    data: {
      name: body.name,
      email: body.email,
      phone: body.phone,
      region: body.region,
      town: body.town,
      farmingType: body.farmingType,
      farmSize: body.farmSize,
      twoFactor: body.twoFactor,
      iotInterest: body.iotInterest,
      interests: body.interests,
      specialization: body.specialization,
      experience: body.experience,
      institution: body.institution,
      position: body.position,
      organization: body.organization,
    },
  });

  // The session cookie caches name/email — refresh it so the
  // sidebar/topbar reflect the change without needing to log out.
  await createSession({
    userId: updated.id,
    role: updated.role,
    name: updated.name,
    email: updated.email,
  });

  return NextResponse.json({ success: true });
}
