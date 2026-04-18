import fs from "fs";
import path from "path";

export interface TodoItem {
  text: string;
  completed: boolean;
  section: string;
}

export interface TodoStatus {
  googleAccountMigration: {
    completed: number;
    total: number;
    percentComplete: number;
  };
  blazingPaddles: {
    completed: number;
    total: number;
    percentComplete: number;
  };
  localVlmAnalysis: {
    completed: number;
    total: number;
    percentComplete: number;
  };
}

export function parseTodo(): TodoStatus {
  const todoPath = path.join(
    process.env.HOME || "/Users/kmx",
    "Library/CloudStorage/Nextcloud-karlmarx@karlmarx.cc/Documents/TODO.md"
  );

  try {
    const content = fs.readFileSync(todoPath, "utf-8");

    // Split into sections
    const sections = content.split(/^## /m);

    const result: TodoStatus = {
      googleAccountMigration: { completed: 0, total: 0, percentComplete: 0 },
      blazingPaddles: { completed: 0, total: 0, percentComplete: 0 },
      localVlmAnalysis: { completed: 0, total: 0, percentComplete: 0 },
    };

    for (const section of sections) {
      const lines = section.split("\n");
      const sectionName = lines[0]?.toLowerCase() || "";

      const checkboxes = section.match(/- \[([ x])\]/g) || [];
      const total = checkboxes.length;
      const completed = checkboxes.filter((cb) => cb.includes("x")).length;

      if (sectionName.includes("google")) {
        result.googleAccountMigration = {
          completed,
          total,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      } else if (sectionName.includes("blazing")) {
        result.blazingPaddles = {
          completed,
          total,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      } else if (sectionName.includes("vlm")) {
        result.localVlmAnalysis = {
          completed,
          total,
          percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
        };
      }
    }

    return result;
  } catch (error) {
    console.error("Error parsing TODO.md:", error);
    return {
      googleAccountMigration: { completed: 0, total: 0, percentComplete: 0 },
      blazingPaddles: { completed: 0, total: 0, percentComplete: 0 },
      localVlmAnalysis: { completed: 0, total: 0, percentComplete: 0 },
    };
  }
}
