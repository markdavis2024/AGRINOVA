import { NextResponse } from "next/server";

export async function GET() {
  // Return mock stats data for now
  const stats = [
    { key: "listings", label: "Total listings", value: "12", change: "+2 this week", icon: "Store", tone: "sky" },
    { key: "active", label: "Active listings", value: "8", change: "4 available", icon: "Sprout", tone: "sky" },
    { key: "orders", label: "Orders received", value: "5", change: "2 pending", icon: "Package", tone: "green" },
    { key: "sales", label: "This month's sales", value: "245,000 FCFA", change: "+12%", icon: "Banknote", tone: "yellow" },
    { key: "unread", label: "Messages", value: "3", change: "2 unread", icon: "MessageSquare", tone: "green" },
    { key: "sensors", label: "Connected sensors", value: "2", change: "All active", icon: "Activity", tone: "sky" },
  ];

  return NextResponse.json({ stats });
}