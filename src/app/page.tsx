import { ToolCard } from "@/components/ui/ToolCard";
import { getToolsByCategory } from "@/lib/config/tools.config";

export default function HomePage() {
  const pdfTools = getToolsByCategory("pdf");
  const aiTools = getToolsByCategory("ai");

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-signal">
              23 tools, one workspace
            </span>
            <h1 className="mt-4 font-display text-5xl leading-[1.1] text-text-primary">
              Every document tool, minus the clutter.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-text-secondary">
              Merge, convert, and clean up your PDFs. Then let AI read them, summarize
              them, and answer questions about what&apos;s inside.
            </p>
            <div className="mt-8 flex gap-3">
              <a
                href="#pdf-tools"
                className="rounded-[var(--radius-md)] bg-signal px-6 py-3 text-sm font-medium text-ink hover:bg-signal-dim hover:text-white"
              >
                Browse tools
              </a>
            </div>
          </div>

          <div className="relative mx-auto flex h-64 w-52 items-center justify-center">
            <div className="absolute h-56 w-44 -rotate-6 rounded-[var(--radius-md)] border border-border bg-surface" />
            <div className="absolute h-56 w-44 rotate-3 rounded-[var(--radius-md)] border border-border bg-surface" />
            <div className="relative h-56 w-44 overflow-hidden rounded-[var(--radius-md)] border border-signal/40 bg-paper shadow-[0_0_40px_-10px_rgba(79,124,255,0.35)]">
              <div className="space-y-2 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-1.5 rounded-full bg-ink/10"
                    style={{ width: `${70 + ((i * 13) % 25)}%` }}
                  />
                ))}
              </div>
              <div className="scan-line pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-signal/0 via-signal/40 to-signal/0" />
            </div>
          </div>
        </div>
      </section>

      <section id="pdf-tools" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-text-muted">
            01 — PDF Tools
          </span>
          <h2 className="mt-2 font-display text-3xl text-text-primary">
            The everyday PDF toolkit
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pdfTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      <section id="ai-tools" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10">
          <span className="font-mono text-xs uppercase tracking-widest text-amber">
            02 — AI Tools
          </span>
          <h2 className="mt-2 font-display text-3xl text-text-primary">
            Let AI read the fine print
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {aiTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>
    </>
  );
}
