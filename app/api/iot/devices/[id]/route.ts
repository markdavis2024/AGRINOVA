import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "FARMER") {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    const deviceId = parseInt(params.id);
    const body = await request.json().catch(() => ({}));
    const { active, name, location, minThreshold, maxThreshold, alertEnabled } = body;

    // Verify device belongs to user
    const existingDevice = await prisma.device.findFirst({
      where: {
        id: deviceId,
        farmerId: session.userId,
      },
    });

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not found." },
        { status: 404 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { id: deviceId },
      data: {
        active: active !== undefined ? active : existingDevice.active,
        name: name || existingDevice.name,
        location: location !== undefined ? location : existingDevice.location,
        minThreshold: minThreshold !== undefined ? minThreshold : existingDevice.minThreshold,
        maxThreshold: maxThreshold !== undefined ? maxThreshold : existingDevice.maxThreshold,
        alertEnabled: alertEnabled !== undefined ? alertEnabled : existingDevice.alertEnabled,
      },
    });

    return NextResponse.json({
      success: true,
      device: updatedDevice,
    });
  } catch (error) {
    console.error("IoT Device PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update device." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();

    if (!session || session.role !== "FARMER") {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    const deviceId = parseInt(params.id);

    // Verify device belongs to user
    const existingDevice = await prisma.device.findFirst({
      where: {
        id: deviceId,
        farmerId: session.userId,
      },
    });

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not found." },
        { status: 404 }
      );
    }

    // Delete device (cascade will delete readings and alerts)
    await prisma.device.delete({
      where: { id: deviceId },
    });

    return NextResponse.json({
      success: true,
      message: "Device deleted successfully.",
    });
  } catch (error) {
    console.error("IoT Device DELETE error:", error);
    return NextResponse.json(
      { error: "Failed to delete device." },
      { status: 500 }
    );
  }
}