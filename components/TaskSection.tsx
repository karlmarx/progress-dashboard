import { Section } from "@/lib/status";
import TaskCard from "./TaskCard";

export default function TaskSection({ section }: { section: Section }) {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-[#ff3355] mb-4">{section.title}</h2>
      <div className="space-y-2">
        {section.tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
