import { parseCoordination } from "./parseCoordination";
import { parseTodo } from "./parseTodo";
import { getProcessStatus } from "./processStatus";

export type TaskStatus = "finished" | "in-flight" | "not-started";

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  progress?: number; // 0-100
  elapsedTime?: string;
  description: string;
}

export interface Section {
  title: string;
  tasks: Task[];
}

export async function getAllStatus(): Promise<Section[]> {
  const coordination = parseCoordination();
  const todo = parseTodo();
  const processes = await getProcessStatus();

  const sections: Section[] = [
    {
      title: "Active Workloads",
      tasks: [
        {
          id: "mlx-vlm-reprocessor",
          name: "MLX-VLM Reprocessor",
          status: processes.mlxVlmRunning ? "in-flight" : "finished",
          progress: processes.mlxVlmRunning ? 25 : 100, // Rough estimate
          elapsedTime: processes.mlxVlmElapsedTime,
          description:
            "Reprocessing 120 workout videos with MLX-VLM (vision model inference)",
        },
        {
          id: "photo-memory-phase1",
          name: "Photo-Memory Phase 1 (Dedup)",
          status: processes.photoMemoryRunning ? "in-flight" : "finished",
          progress: processes.photoMemoryProgress,
          description:
            "Deduplicating photos from Google Takeout export (66.9% complete when paused)",
        },
      ],
    },
    {
      title: "Long-Term Projects",
      tasks: [
        {
          id: "google-account-migration",
          name: "Google Account Migration",
          status: todo.googleAccountMigration.percentComplete < 100 ? "in-flight" : "finished",
          progress: todo.googleAccountMigration.percentComplete,
          description: `Moving from old account to karlmarx9193@gmail.com (${todo.googleAccountMigration.completed}/${todo.googleAccountMigration.total} items)`,
        },
        {
          id: "blazing-paddles",
          name: "Blazing Paddles Website",
          status: todo.blazingPaddles.percentComplete < 100 ? "in-flight" : "finished",
          progress: todo.blazingPaddles.percentComplete,
          description: `Kayak rental site rewrite (${todo.blazingPaddles.completed}/${todo.blazingPaddles.total} items)`,
        },
        {
          id: "local-vlm-analysis",
          name: "Local VLM Analysis",
          status: todo.localVlmAnalysis.percentComplete < 100 ? "in-flight" : "finished",
          progress: todo.localVlmAnalysis.percentComplete,
          description: `Bulk photo/video understanding pipeline (${todo.localVlmAnalysis.completed}/${todo.localVlmAnalysis.total} items)`,
        },
      ],
    },
    {
      title: "System Health",
      tasks: [
        {
          id: "ram-available",
          name: `RAM Status: ${coordination.freeRam}GB free`,
          status:
            coordination.freeRam < 0.5
              ? "finished"
              : coordination.freeRam < 1
                ? "in-flight"
                : "not-started",
          progress:
            coordination.freeRam > 1
              ? 100
              : (coordination.freeRam / 1) * 100,
          description: `${coordination.totalUsedRam}GB / 36GB used (MLX: ${coordination.mlxVlmMemory}GB, Photo-Memory: ${coordination.photoMemoryPhase1Memory.toFixed(1)}GB)`,
        },
      ],
    },
  ];

  return sections;
}
