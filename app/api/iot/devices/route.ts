import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { randomBytes } from "crypto";

function generateDeviceKey(): string {
  return `agri_${randomBytes(32).toString('hex')}`;
}

export async function GET() {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const devices = await prisma.device.findMany({
      where: { farmerId: Number(session.user.id) },
      orderBy: { createdAt: "desc" },
    });

    // Get latest reading for each device
    const devicesWithReadings = await Promise.all(
      devices.map(async (device) => {
        const latestReading = await prisma.reading.findFirst({
          where: { deviceId: device.id },
          orderBy: { timestamp: "desc" },
        });

        // Get farm if exists
        let farm = null;
        if (device.farmId) {
          farm = await prisma.farm.findUnique({
            where: { id: device.farmId },
            select: { id: true, name: true },
          });
        }

        return {
          ...device,
          farm: farm,
          lastReading: latestReading || null,
        };
      })
    );

    return NextResponse.json({ devices: devicesWithReadings });
  } catch (error) {
    console.error("IoT Devices GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch devices." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { error: "Only farmer accounts can add devices." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, type, location, farmId, minThreshold, maxThreshold } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: "Please provide a name and type for the device." },
        { status: 400 }
      );
    }

    const deviceKey = generateDeviceKey();

    const device = await prisma.device.create({
      data: {
        name: name.trim(),
        type: type,
        location: location || null,
        farmId: farmId || null,
        deviceKey: deviceKey,
        minThreshold: minThreshold || null,
        maxThreshold: maxThreshold || null,
        farmerId: Number(session.user.id),
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        device: {
          ...device,
          deviceKey: deviceKey,
        }
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("IoT Devices POST error:", error);
    return NextResponse.json(
      { error: "Failed to create device." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.user.role !== "FARMER") {
      return NextResponse.json(
        { error: "Not authorized." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, active, name, location, minThreshold, maxThreshold, alertEnabled } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Device ID required." },
        { status: 400 }
      );
    }

    // Verify device belongs to user
    const existingDevice = await prisma.device.findFirst({
      where: {
        id: parseInt(id),
        farmerId: Number(session.user.id),
      },
    });

    if (!existingDevice) {
      return NextResponse.json(
        { error: "Device not found." },
        { status: 404 }
      );
    }

    const updatedDevice = await prisma.device.update({
      where: { id: parseInt(id) },
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
    console.error("IoT Devices PATCH error:", error);
    return NextResponse.json(
      { error: "Failed to update device." },
      { status: 500 }
    );
  }
}