import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";

// GET - Fetch consultations for the current user
export async function GET() {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    let consultations;

    if (session.role === "FARMER") {
      consultations = await prisma.consultation.findMany({
        where: { farmerId: session.userId },
        include: {
          agronomist: {
            select: { id: true, name: true, email: true, phone: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else if (session.role === "AGRONOMIST") {
      consultations = await prisma.consultation.findMany({
        where: {
          OR: [
            { agronomistId: session.userId },
            { agronomistId: null, status: "PENDING" },
          ],
        },
        include: {
          farmer: {
            select: { id: true, name: true, email: true, phone: true, region: true, town: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    return NextResponse.json({ consultations });
  } catch (error) {
    console.error("Consultations GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch consultations." },
      { status: 500 }
    );
  }
}

// POST - Create a new consultation
export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== "FARMER") {
      return NextResponse.json(
        { error: "Only farmers can create consultations." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subject, notes, scheduledAt, agronomistId } = body;

    if (!subject) {
      return NextResponse.json(
        { error: "Please provide a subject for the consultation." },
        { status: 400 }
      );
    }

    // Create consultation
    const consultation = await prisma.consultation.create({
      data: {
        subject: subject.trim(),
        notes: notes || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        farmerId: session.userId,
        agronomistId: agronomistId || null,
      },
      include: {
        farmer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        agronomist: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    // Create notification for the farmer
    await createNotification({
      userId: session.userId,
      title: "📅 Consultation Booked",
      message: `Your consultation "${subject}" has been booked successfully.`,
      type: "success",
      link: "/farmer/consultations",
    });

    // If an agronomist is assigned, notify them
    if (agronomistId) {
      await createNotification({
        userId: agronomistId,
        title: "📅 New Consultation Request",
        message: `A farmer has requested a consultation: "${subject}"`,
        type: "info",
        link: "/agronomist/consultations",
      });
    }

    return NextResponse.json(
      { success: true, consultation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Consultations POST error:", error);
    return NextResponse.json(
      { error: "Failed to create consultation." },
      { status: 500 }
    );
  }
}

// PATCH - Update consultation status (for agronomists)
export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const body = await request.json();
    const { consultationId, status, agronomistId } = body;

    if (!consultationId) {
      return NextResponse.json(
        { error: "Consultation ID required." },
        { status: 400 }
      );
    }

    // Find the consultation
    const consultation = await prisma.consultation.findUnique({
      where: { id: consultationId },
      include: {
        farmer: true,
        agronomist: true,
      },
    });

    if (!consultation) {
      return NextResponse.json(
        { error: "Consultation not found." },
        { status: 404 }
      );
    }

    // Check permissions
    if (session.role === "FARMER" && consultation.farmerId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    if (session.role === "AGRONOMIST" && consultation.agronomistId !== session.userId) {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (status) {
      updateData.status = status;
    }

    if (agronomistId && session.role === "FARMER") {
      // Farmer assigning an agronomist
      updateData.agronomistId = agronomistId;
    }

    // Update consultation
    const updatedConsultation = await prisma.consultation.update({
      where: { id: consultationId },
      data: updateData,
      include: {
        farmer: {
          select: { id: true, name: true, email: true, phone: true },
        },
        agronomist: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    });

    // Create notifications for status changes
    if (status) {
      // Notify farmer
      await createNotification({
        userId: consultation.farmerId,
        title: `📅 Consultation ${status}`,
        message: `Your consultation "${consultation.subject}" is now ${status}.`,
        type: status === "CONFIRMED" ? "success" : status === "CANCELLED" ? "error" : "info",
        link: "/farmer/consultations",
      });

      // Notify agronomist if assigned
      if (consultation.agronomistId) {
        await createNotification({
          userId: consultation.agronomistId,
          title: `📅 Consultation ${status}`,
          message: `Consultation "${consultation.subject}" is now ${status}.`,
          type: status === "CONFIRMED" ? "success" : status === "CANCELLED" ? "error" : "info",
          link: "/agronomist/consultations",
        });
      }
    }

    return NextResponse.json({
      success: true,
      consultation: updatedConsultation,
    });
  } catch (error) {
    console.error("Consultations PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update consultation." },
      { status: 500 }
    );
  }
}