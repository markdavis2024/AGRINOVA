import { NextResponse } from "next/server";

export async function GET() {
  // Return a mock session for development
  return NextResponse.json({
    session: {
      user: {
        id: "1",
        name: "John Farmer",
        email: "farmer@agrinova.cm",
        role: "FARMER",
        region: "Centre",
        iotInterest: true,
      }
    }
  });
}