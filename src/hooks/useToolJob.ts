import { useCallback, useRef, useState } from "react";
import { getJobStatus, submitPromptJob, submitToolJob } from "@/lib/api/toolJobs";
import { JobStatus } from "@/lib/types/tool.types";

const POLL_INTERVAL_MS = 2000;

interface UseToolJobResult {
  status: JobStatus;
  progress: number;
  resultUrl: string | null;
  resultText: string | null;
  errorMessage: string | null;
  runFileJob: (endpoint: string, files: File[], options?: Record<string, string>) => Promise<void>;
  runPromptJob: (endpoint: string, prompt: string, options?: Record<string, string>) => Promise<void>;
  reset: () => void;
}

export function useToolJob(): UseToolJobResult {
  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollHandle = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollHandle.current) {
      clearInterval(pollHandle.current);
      pollHandle.current = null;
    }
  };

  const pollJob = useCallback((jobId: string) => {
    pollHandle.current = setInterval(async () => {
      const response = await getJobStatus(jobId);

      if (!response.success || !response.data) {
        stopPolling();
        setStatus("failed");
        setErrorMessage(response.error ?? "Could not check job status.");
        return;
      }

      const { status: jobStatus, progress: jobProgress, resultUrl: url, resultText: text, error } = response.data;
      setProgress(jobProgress);

      if (jobStatus === "completed") {
        stopPolling();
        setStatus("completed");
        setResultUrl(url ?? null);
        setResultText(text ?? null);
        return;
      }

      if (jobStatus === "failed") {
        stopPolling();
        setStatus("failed");
        setErrorMessage(error ?? "Processing failed.");
        return;
      }

      setStatus(jobStatus);
    }, POLL_INTERVAL_MS);
  }, []);

  const runFileJob = useCallback(
    async (endpoint: string, files: File[], options?: Record<string, string>) => {
      setStatus("uploading");
      setErrorMessage(null);
      setResultUrl(null);
      setResultText(null);
      setProgress(0);

      const response = await submitToolJob(endpoint, files, options);

      if (!response.success || !response.data) {
        setStatus("failed");
        setErrorMessage(response.error ?? "Upload failed.");
        return;
      }

      setStatus("queued");
      pollJob(response.data.jobId);
    },
    [pollJob]
  );

  const runPromptJob = useCallback(
    async (endpoint: string, prompt: string, options?: Record<string, string>) => {
      setStatus("uploading");
      setErrorMessage(null);
      setResultUrl(null);
      setResultText(null);
      setProgress(0);

      const response = await submitPromptJob(endpoint, prompt, options);

      if (!response.success || !response.data) {
        setStatus("failed");
        setErrorMessage(response.error ?? "Request failed.");
        return;
      }

      setStatus("queued");
      pollJob(response.data.jobId);
    },
    [pollJob]
  );

  const reset = useCallback(() => {
    stopPolling();
    setStatus("idle");
    setProgress(0);
    setResultUrl(null);
    setResultText(null);
    setErrorMessage(null);
  }, []);

  return { status, progress, resultUrl, resultText, errorMessage, runFileJob, runPromptJob, reset };
}
