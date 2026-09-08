import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getPlatformSettings } from "@/lib/platformSettings";

export async function GET() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const settings = await getPlatformSettings();
  return NextResponse.json({ settings });
}

type UpdateBody = {
  siteName?: string;
  supportEmail?: string;
  supportPhone?: string;
  allowRegistrations?: boolean;
  requireVerification?: boolean;
  maintenanceMode?: boolean;
  announcement?: string;
};

export async function PATCH(request: Request) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const body: UpdateBody = await request.json().catch(() => ({}));

  if (!body.siteName || !body.siteName.trim()) {
    return NextResponse.json({ error: "Site name can't be empty." }, { status: 400 });
  }

  await getPlatformSettings(); // ensure row exists

  const updated = await prisma.platformSettings.update({
    where: { id: 1 },
    data: {
      siteName: body.siteName.trim(),
      supportEmail: body.supportEmail || null,
      supportPhone: body.supportPhone || null,
      allowRegistrations: body.allowRegistrations ?? true,
      requireVerification: body.requireVerification ?? true,
      maintenanceMode: body.maintenanceMode ?? false,
      announcement: body.announcement || null,
    },
  });

  return NextResponse.json({ success: true, settings: updated });
}
