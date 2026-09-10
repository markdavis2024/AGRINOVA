import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      activities: [
        { id: "1", type: "message", farmerName: "Jean Baptiste", action: "asked about yellowing maize leaves", time: "12 min ago" },
        { id: "2", type: "diagnosis", farmerName: "Amina Ndongo", action: "requested a crop diagnosis", time: "1 hour ago" },
        { id: "3", type: "system", farmerName: "System", action: "your credential review is still pending", time: "3 hours ago" },
        { id: "4", type: "consultation", farmerName: "Paul Eto", action: "booked a consultation for Friday", time: "5 hours ago" },
        { id: "5", type: "message", farmerName: "Jean Baptiste", action: "thanked you for your last reply", time: "yesterday" },
      ],
    });
  } catch (error) {
    return NextResponse.json({ activities: [] });
  }
}