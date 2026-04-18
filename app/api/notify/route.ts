import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/db/init";
import { sendMilestoneEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const unsentMilestones = db
      .prepare("SELECT * FROM milestones WHERE email_sent = 0")
      .all() as Array<{
      id: number;
      task_id: string;
      task_name: string;
      completed_at: string;
      email_sent: number;
      created_at: string;
    }>;

    const dashboardUrl =
      process.env.NEXTAUTH_URL || "https://progress.93.fyi";

    for (const milestone of unsentMilestones) {
      await sendMilestoneEmail(milestone.task_name, dashboardUrl);

      // Mark as sent
      db.prepare("UPDATE milestones SET email_sent = 1 WHERE id = ?").run(
        milestone.id
      );
    }

    return NextResponse.json({
      sent: unsentMilestones.length,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}
