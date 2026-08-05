import Link from "next/link";
import { ToolDefinition } from "@/lib/types/tool.types";
import { getIcon } from "@/lib/utils/iconRegistry";

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const Icon = getIcon(tool.icon);

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-colors duration-150 hover:border-signal"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] bg-surface-2 text-signal">
        <Icon size={18} strokeWidth={1.75} />
      </div>
      <div>
        <h3 className="font-display text-lg text-text-primary">{tool.name}</h3>
        <p className="mt-1 text-sm leading-relaxed text-text-secondary">{tool.shortDescription}</p>
      </div>
      {tool.category === "ai" && (
        <span className="absolute right-5 top-5 rounded-full border border-amber/30 bg-amber/10 px-2 py-0.5 text-[11px] font-mono text-amber">
          AI
        </span>
      )}
    </Link>
  );
}
