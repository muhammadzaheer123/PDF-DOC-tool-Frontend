"use client";

import { useState } from "react";
import { ToolDefinition } from "@/lib/types/tool.types";
import { useToolJob } from "@/hooks/useToolJob";
import { FileUploader } from "@/components/tools/FileUploader";
import { ProcessingStatus } from "@/components/tools/ProcessingStatus";
import { ResultDownload } from "@/components/tools/ResultDownload";
import { Button } from "@/components/ui/Button";
import { getIcon } from "@/lib/utils/iconRegistry";

export function ToolPageLayout({ tool }: { tool: ToolDefinition }) {
  const [files, setFiles] = useState<File[]>([]);
  const [prompt, setPrompt] = useState("");
  const [password, setPassword] = useState("");
  const { status, progress, resultUrl, resultText, errorMessage, runFileJob, runPromptJob, reset } = useToolJob();

  const Icon = getIcon(tool.icon);
  const isBusy = status === "uploading" || status === "queued" || status === "processing";
  const isDone = status === "completed";

  const handleSubmit = () => {
    if (tool.inputType === "text-prompt") {
      runPromptJob(tool.endpoint, prompt);
      return;
    }
    runFileJob(tool.endpoint, files, tool.requiresPassword ? { password } : undefined);
  };

  const canSubmit =
    tool.inputType === "text-prompt"
      ? prompt.trim().length > 0
      : files.length > 0 && (!tool.requiresPassword || password.trim().length > 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-surface-2 text-signal">
          <Icon size={20} strokeWidth={1.75} />
        </div>
        <div>
          <h1 className="font-display text-2xl text-text-primary">{tool.name}</h1>
          <p className="text-sm text-text-secondary">{tool.shortDescription}</p>
        </div>
      </div>

      {!isDone && (
        <div className="space-y-5">
          {tool.inputType === "text-prompt" ? (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you need..."
              rows={6}
              disabled={isBusy}
              className="w-full resize-none rounded-[var(--radius-lg)] border border-border bg-surface p-4 text-sm text-text-primary outline-none focus:border-signal"
            />
          ) : (
            <FileUploader
              acceptedFileTypes={tool.acceptedFileTypes}
              maxFiles={tool.maxFiles}
              files={files}
              onFilesChange={setFiles}
            />
          )}

          {tool.requiresPassword && (
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={isBusy}
              className="w-full rounded-[var(--radius-lg)] border border-border bg-surface p-3.5 text-sm text-text-primary outline-none focus:border-signal"
            />
          )}

          <Button onClick={handleSubmit} disabled={!canSubmit || isBusy} isLoading={isBusy} className="w-full">
            {isBusy ? "Working on it" : "Run"}
          </Button>

          {status !== "idle" && <ProcessingStatus status={status} progress={progress} />}

          {status === "failed" && errorMessage && (
            <div className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger/5 p-4 text-sm text-danger">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {isDone && <ResultDownload resultUrl={resultUrl} resultText={resultText} onReset={reset} />}
    </div>
  );
}
