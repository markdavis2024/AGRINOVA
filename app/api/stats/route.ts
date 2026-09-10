import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // In production, get session and return real stats based on role
    // For now, return mock stats that work for all dashboards

    return NextResponse.json({
      stats: {
        // Farmer stats
        farmer: {
          listings: 12,
          active: 8,
          orders: 5,
          sales: "245,000 FCFA",
          unread: 3,
          sensors: 2,
        },
        // Buyer stats
        buyer: {
          placed: 8,
          transit: 3,
          farmers: 5,
          spend: "185,000 FCFA",
          unread: 2,
          listings: 89,
        },
        // Agronomist stats
        agronomist: {
          conversations: 24,
          unread: 5,
          consultations: 12,
          diagnosis: 8,
          articles: 6,
          credential: "Verified",
          credentialStatus: "Approved",
        },
      },
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}