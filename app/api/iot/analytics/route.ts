import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();

    if (!session || session.role !== "FARMER") {
      return NextResponse.json({ error: "Not authorized." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const deviceId = searchParams.get("deviceId");
    const days = parseInt(searchParams.get("days") || "7");

    if (!deviceId) {
      return NextResponse.json(
        { error: "Device ID required." },
        { status: 400 }
      );
    }

    // First verify device belongs to user
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

    // Get readings for the device
    const readings = await prisma.reading.findMany({
      where: {
        deviceId: parseInt(deviceId),
        timestamp: {
          gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { timestamp: "asc" },
    });

    // Calculate statistics
    const values = readings.map((r) => r.value);
    const count = readings.length;
    
    let min: number | null = null;
    let max: number | null = null;
    let average: number | null = null;
    let current: number | null = null;

    if (count > 0) {
      min = Math.min(...values);
      max = Math.max(...values);
      average = values.reduce((a, b) => a + b, 0) / count;
      current = readings[readings.length - 1].value;
    }

    const analytics = {
      device: {
        id: device.id,
        name: device.name,
        type: device.type,
      },
      summary: {
        count: count,
        min: min,
        max: max,
        average: average,
        current: current,
      },
      readings: readings.map((r) => ({
        value: r.value,
        unit: r.unit,
        timestamp: r.timestamp,
      })),
      thresholds: {
        min: device.minThreshold,
        max: device.maxThreshold,
      },
      healthStatus: getHealthStatus(values, device.minThreshold, device.maxThreshold),
    };

    return NextResponse.json({ analytics: analytics });
  } catch (error) {
    console.error("IoT Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics." },
      { status: 500 }
    );
  }
}

function getHealthStatus(
  values: number[], 
  minThreshold: number | null, 
  maxThreshold: number | null
): string {
  if (values.length === 0) {
    return "NO_DATA";
  }
  
  const recentValue = values[values.length - 1];
  
  if (minThreshold !== null && recentValue < minThreshold) {
    return "BELOW_THRESHOLD";
  }
  
  if (maxThreshold !== null && recentValue > maxThreshold) {
    return "ABOVE_THRESHOLD";
  }
  
  if (values.length > 5) {
    const recent = values.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    const variance = recent.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / recent.length;
    
    if (variance > 10) {
      return "FLUCTUATING";
    }
  }
  
  return "HEALTHY";
}