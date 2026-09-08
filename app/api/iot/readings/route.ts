import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

type ReadingType = 
  | "SOIL_MOISTURE"
  | "SOIL_TEMPERATURE"
  | "SOIL_PH"
  | "SOIL_NPK"
  | "AIR_TEMPERATURE"
  | "AIR_HUMIDITY"
  | "RAINFALL"
  | "WIND_SPEED"
  | "LIGHT_INTENSITY"
  | "WATER_LEVEL"
  | "PRESSURE"
  | "OTHER";

// Public endpoint for hardware devices to send data
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { deviceKey, type, value, unit, timestamp, latitude, longitude } = body;

    if (!deviceKey) {
      return NextResponse.json(
        { error: "Missing required field: deviceKey" },
        { status: 400 }
      );
    }

    if (!type) {
      return NextResponse.json(
        { error: "Missing required field: type" },
        { status: 400 }
      );
    }

    if (value === undefined || value === null) {
      return NextResponse.json(
        { error: "Missing required field: value" },
        { status: 400 }
      );
    }

    // Find the device by key
    const device = await prisma.device.findUnique({
      where: { deviceKey: deviceKey },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Invalid device key." },
        { status: 401 }
      );
    }

    if (!device.active) {
      return NextResponse.json(
        { error: "Device is inactive." },
        { status: 403 }
      );
    }

    // Store the reading
    const reading = await prisma.reading.create({
      data: {
        value: parseFloat(value),
        unit: unit || getDefaultUnit(type),
        type: type as ReadingType,
        timestamp: timestamp ? new Date(timestamp) : new Date(),
        latitude: latitude || null,
        longitude: longitude || null,
        deviceId: device.id,
      },
    });

    // Update device's last reading timestamp
    await prisma.device.update({
      where: { id: device.id },
      data: { lastReading: new Date() },
    });

    // Check for threshold violations
    if (device.alertEnabled) {
      await checkThresholds(device, reading.value);
    }

    return NextResponse.json({
      success: true,
      reading: reading,
      message: "Reading recorded successfully.",
    });

  } catch (error) {
    console.error("IoT ingestion error:", error);
    return NextResponse.json(
      { error: "Failed to process reading." },
      { status: 500 }
    );
  }
}

function getDefaultUnit(type: string): string {
  const units: Record<string, string> = {
    SOIL_MOISTURE: "%",
    SOIL_TEMPERATURE: "°C",
    SOIL_PH: "pH",
    SOIL_NPK: "ppm",
    AIR_TEMPERATURE: "°C",
    AIR_HUMIDITY: "%",
    RAINFALL: "mm",
    WIND_SPEED: "km/h",
    LIGHT_INTENSITY: "lux",
    WATER_LEVEL: "cm",
    PRESSURE: "hPa",
  };
  return units[type] || "units";
}

async function checkThresholds(device: any, value: number) {
  if (!device.alertEnabled) return;

  let alertMessage = null;
  let severity = "INFO";

  if (device.minThreshold !== null && value < device.minThreshold) {
    alertMessage = `${device.name}: Reading ${value} is below minimum threshold (${device.minThreshold})`;
    severity = "WARNING";
  } else if (device.maxThreshold !== null && value > device.maxThreshold) {
    alertMessage = `${device.name}: Reading ${value} is above maximum threshold (${device.maxThreshold})`;
    severity = "WARNING";
  }

  if (alertMessage && device.farmerId) {
    try {
      await prisma.alert.create({
        data: {
          message: alertMessage,
          severity: severity,
          deviceId: device.id,
          farmerId: device.farmerId,
        },
      });
      console.log(`🔔 ALERT: ${alertMessage}`);
    } catch (alertError) {
      console.error("Failed to create alert:", alertError);
    }
  }
}

// Get readings for a specific device (authenticated)
export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const days = parseInt(searchParams.get("days") || "7");
    const limit = parseInt(searchParams.get("limit") || "100");

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID required." },
        { status: 400 }
      );
    }

    // Verify device belongs to user
    const device = await prisma.device.findFirst({
      where: {
        id: parseInt(deviceId),
        farmerId: session.userId,
      },
    });

    if (!device) {
      return NextResponse.json(
        { error: "Device not found." },
        { status: 404 }
      );
    }

    const readings = await prisma.reading.findMany({
      where: {
        deviceId: parseInt(deviceId),
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { timestamp: "asc" },
      take: limit,
    });

    return NextResponse.json({ readings: readings });
  } catch (error) {
    console.error("IoT GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch readings." },
      { status: 500 }
    );
  }
} 