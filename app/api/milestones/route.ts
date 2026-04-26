import { NextRequest, NextResponse } from "next/server";
import { getDb, initDb } from "@/db/init";

// Initialize DB on first load
initDb();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task_id, task_name } = body;

    const db = getDb();
    const stmt = db.prepare(
      "INSERT OR IGNORE INTO milestones (task_id, task_name) VALUES (?, ?)"
    );
    stmt.run(task_id, task_name);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Failed to create milestone" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM milestones WHERE email_sent = 0");
    const unsent = stmt.all();

    return NextResponse.json(unsent);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Failed to fetch milestones" },
      { status: 500 }
    );
  }
}
