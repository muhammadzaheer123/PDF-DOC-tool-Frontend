import { JobStatus } from "@/lib/types/tool.types";

const STATUS_LABEL: Record<JobStatus, string> = {
  idle: "",
  uploading: "Uploading",
  queued: "Queued",
  processing: "Processing",
  completed: "Done",
  failed: "Failed",
};

export function ProcessingStatus({ status, progress }: { status: JobStatus; progress: number }) {
  if (status === "idle") return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-primary">{STATUS_LABEL[status]}</span>
        {status !== "failed" && status !== "completed" && (
          <span className="font-mono text-text-muted">{progress}%</span>
        )}
      </div>
      {status !== "failed" && status !== "completed" && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-signal transition-all duration-500"
            style={{ width: `${Math.max(progress, 6)}%` }}
          />
        </div>
      )}
    </div>
  );
}
