import fs from "fs";
import path from "path";

export interface CoordinationStatus {
  mlxVlmMemory: number; // GB
  photoMemoryPhase1Memory: number; // GB
  totalUsedRam: number; // GB
  freeRam: number; // GB
  criticalThreshold: number; // MB
}

export function parseCoordination(): CoordinationStatus {
  const coordPath = path.join(
    process.env.HOME || "/Users/kmx",
    ".claude/coordination.md"
  );

  try {
    const content = fs.readFileSync(coordPath, "utf-8");

    // Parse: "**MLX-VLM reprocessor:** ~15 GB (active)"
    const mlxMatch = content.match(/MLX-VLM.*?~(\d+)\s*GB/);
    const mlxVlmMemory = mlxMatch ? parseInt(mlxMatch[1]) : 0;

    // Parse: "**Photo-memory Phase 1:** ~3-5 GB (paused at 66.9%)"
    const photoMatch = content.match(/Photo-memory.*?~(\d+)-(\d+)\s*GB/);
    const photoMemoryPhase1Memory = photoMatch
      ? parseInt(photoMatch[1]) + parseInt(photoMatch[2]) / 2
      : 0;

    // Parse: "**Current state:** 35/36 GB used (~1GB free)"
    const stateMatch = content.match(/(\d+)\/(\d+)\s*GB used.*?~(\d+)GB free/);
    const totalUsedRam = stateMatch ? parseInt(stateMatch[1]) : 0;
    const freeRam = stateMatch ? parseInt(stateMatch[3]) : 0;

    return {
      mlxVlmMemory,
      photoMemoryPhase1Memory,
      totalUsedRam,
      freeRam,
      criticalThreshold: 200,
    };
  } catch (error) {
    console.error("Error parsing coordination.md:", error);
    return {
      mlxVlmMemory: 0,
      photoMemoryPhase1Memory: 0,
      totalUsedRam: 0,
      freeRam: 0,
      criticalThreshold: 200,
    };
  }
}
