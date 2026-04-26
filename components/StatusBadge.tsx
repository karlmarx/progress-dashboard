import { TaskStatus } from "@/lib/status";

export default function StatusBadge({ status }: { status: TaskStatus }) {
  const colors: Record<TaskStatus, string> = {
    finished: "bg-[#00cc66] text-black",
    "in-flight": "bg-[#ffcc00] text-black",
    "not-started": "bg-[#555566] text-white",
  };

  const labels: Record<TaskStatus, string> = {
    finished: "Finished",
    "in-flight": "In Flight",
    "not-started": "Not Started",
  };

  return (
    <span className={`px-3 py-1 rounded text-sm font-semibold ${colors[status]}`}>
      {labels[status]}
    </span>
  );
}
