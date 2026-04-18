import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs";

const execAsync = promisify(exec);

export interface ProcessStatus {
  mlxVlmRunning: boolean;
  photoMemoryRunning: boolean;
  mlxVlmElapsedTime: string; // e.g., "25:32" (hours:minutes)
  photoMemoryProgress: number; // percentage
}

export async function getProcessStatus(): Promise<ProcessStatus> {
  try {
    const { stdout } = await execAsync("ps aux");

    const mlxVlmRunning = stdout.includes("mlx-vlm") && stdout.includes("reprocess");
    const photoMemoryRunning = stdout.includes("phase1_dedupe.py");

    let mlxVlmElapsedTime = "N/A";
    let photoMemoryProgress = 0;

    // Parse MLX elapsed time from ps output
    // Format: "25:32.00" (hours:minutes.seconds)
    const mlxMatch = stdout.match(/(\d+):(\d{2})\.(\d{2})/);
    if (mlxMatch) {
      const hours = mlxMatch[1];
      const minutes = mlxMatch[2];
      mlxVlmElapsedTime = `${hours}h ${minutes}m`;
    }

    // Parse photo-memory progress from log file
    try {
      const logPath = "/Volumes/Crucial X9/photo-memory/logs/phase1.log";
      const logContent = fs.readFileSync(logPath, "utf-8");

      // Look for progress indicators in log
      const progressMatch = logContent.match(/(\d+\.?\d*)%/);
      if (progressMatch) {
        photoMemoryProgress = parseFloat(progressMatch[1]);
      }
    } catch (e) {
      // Log file not accessible, keep progress at 0
    }

    return {
      mlxVlmRunning,
      photoMemoryRunning,
      mlxVlmElapsedTime,
      photoMemoryProgress,
    };
  } catch (error) {
    console.error("Error getting process status:", error);
    return {
      mlxVlmRunning: false,
      photoMemoryRunning: false,
      mlxVlmElapsedTime: "N/A",
      photoMemoryProgress: 0,
    };
  }
}
