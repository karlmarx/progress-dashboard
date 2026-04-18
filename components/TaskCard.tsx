import { Task } from "@/lib/status";
import StatusBadge from "./StatusBadge";
import ProgressBar from "./ProgressBar";

export default function TaskCard({ task }: { task: Task }) {
  return (
    <div className="bg-[#111118] border border-[#1a1a24] rounded p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-white">{task.name}</h3>
        <StatusBadge status={task.status} />
      </div>

      <p className="text-[#8888aa] text-sm mb-3">{task.description}</p>

      {task.progress !== undefined && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-[#555566] mb-1">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <ProgressBar progress={task.progress} />
        </div>
      )}

      {task.elapsedTime && (
        <p className="text-xs text-[#555566]">Elapsed: {task.elapsedTime}</p>
      )}
    </div>
  );
}
