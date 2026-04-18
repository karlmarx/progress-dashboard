export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div className="w-full bg-[#1a1a24] rounded h-2 overflow-hidden">
      <div
        className="bg-[#ff3355] h-full transition-all duration-300"
        style={{ width: `${Math.min(progress, 100)}%` }}
      />
    </div>
  );
}
