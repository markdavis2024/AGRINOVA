import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      farmers: [
        { id: "1", name: "Jean Baptiste", location: "Bamenda", crop: "Maize", lastActive: "2 min ago", status: "online" },
        { id: "2", name: "Marie Claire", location: "Yaoundé", crop: "Tomatoes", lastActive: "1 hour ago", status: "online" },
        { id: "3", name: "Paul Atanga", location: "Douala", crop: "Cassava", lastActive: "3 hours ago", status: "offline" },
        { id: "4", name: "Amina Ndongo", location: "Buea", crop: "Cocoa", lastActive: "5 hours ago", status: "offline" },
      ],
    });
  } catch (error) {
    return NextResponse.json({ farmers: [] });
  }
}