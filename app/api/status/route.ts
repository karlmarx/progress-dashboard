import { NextRequest, NextResponse } from "next/server";
import { getAllStatus } from "@/lib/status";

export async function GET(request: NextRequest) {
  try {
    const status = await getAllStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("Error fetching status:", error);
    return NextResponse.json(
      { error: "Failed to fetch status" },
      { status: 500 }
    );
  }
}
