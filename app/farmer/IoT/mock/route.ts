import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Generate realistic mock sensor data
function generateMockValue(type: string): { value: number; unit: string } {
  const mockData: Record<string, { min: number; max: number; unit: string; trend?: number }> = {
    SOIL_MOISTURE: { min: 25, max: 75, unit: "%" },
    AIR_TEMPERATURE: { min: 18, max: 35, unit: "°C" },
    AIR_HUMIDITY: { min: 45, max: 85, unit: "%" },
    SOIL_TEMPERATURE: { min: 20, max: 32, unit: "°C" },
    RAINFALL: { min: 0, max: 15, unit: "mm" },
    WIND_SPEED: { min: 0, max: 25, unit: "km/h" },
    SOIL_PH: { min: 5.5, max: 7.5, unit: "pH" },
    SOIL_NPK: { min: 20, max: 80, unit: "ppm" },
    LIGHT_INTENSITY: { min: 100, max: 800, unit: "lux" },
    WATER_LEVEL: { min: 10, max: 90, unit: "cm" },
    PRESSURE: { min: 980, max: 1020, unit: "hPa" },
  };

  const data = mockData[type] || mockData.SOIL_MOISTURE;
  const value = Math.round((Math.random() * (data.max - data.min) + data.min) * 10) / 10;
  
  return { value, unit: data.unit };
}

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Please sign in." }, { status: 401 });
    }

    const { deviceId, count = 20 } = await request.json();

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

    const readings = [];

    // Generate mock readings spread over time
    const now = new Date();
    const totalReadings = Math.min(count, 50);

    for (let i = totalReadings - 1; i >= 0; i--) {
      const mockData = generateMockValue(device.type);
      
      const reading = await prisma.reading.create({
        data: {
          deviceId: device.id,
          value: mockData.value,
          unit: mockData.unit,
          type: device.type as any,
          timestamp: new Date(now.getTime() - i * 60000 * 5), // Spread over minutes
        },
      });
      
      readings.push(reading);
    }

    // Update device last reading
    if (readings.length > 0) {
      await prisma.device.update({
        where: { id: device.id },
        data: { lastReading: new Date() },
      });
    }

    return NextResponse.json({
      success: true,
      message: `Generated ${readings.length} mock readings for ${device.name}`,
      readings: readings,
    });
  } catch (error) {
    console.error("Mock data error:", error);
    return NextResponse.json(
      { error: "Failed to generate mock data." },
      { status: 500 }
    );
  }
}