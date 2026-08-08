import { useCallback, useRef, useState } from "react";
import {
  getJobStatus,
  submitPromptJob,
  submitToolJob,
} from "@/lib/api/toolJobs";
import { JobStatus } from "@/lib/types/tool.types";

const POLL_INTERVAL_MS = 1500;
const SIMULATED_PROGRESS_INTERVAL_MS = 400;
const SIMULATED_PROGRESS_CAP = 90;

interface UseToolJobResult {
  status: JobStatus;
  progress: number;
  resultUrl: string | null;
  resultText: string | null;
  errorMessage: string | null;
  runFileJob: (
    endpoint: string,
    files: File[],
    options?: Record<string, string>,
  ) => Promise<void>;
  runPromptJob: (
    endpoint: string,
    prompt: string,
    options?: Record<string, string>,
  ) => Promise<void>;
  reset: () => void;
}

export function useToolJob(): UseToolJobResult {
  const [status, setStatus] = useState<JobStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultText, setResultText] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollHandle = useRef<ReturnType<typeof setInterval> | null>(null);
  const simHandle = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollHandle.current) {
      clearInterval(pollHandle.current);
      pollHandle.current = null;
    }
  };

  const stopSimulatedProgress = () => {
    if (simHandle.current) {
      clearInterval(simHandle.current);
      simHandle.current = null;
    }
  };

  // Processing now finishes inside a single request, so the backend has no
  // real incremental progress to report. We animate progress smoothly while
  // waiting, then snap to 100% the moment the result actually arrives.
  const startSimulatedProgress = useCallback(() => {
    stopSimulatedProgress();
    setProgress(5);
    simHandle.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= SIMULATED_PROGRESS_CAP) return prev;
        const step = prev < 40 ? 4 : prev < 70 ? 2 : 1;
        return Math.min(prev + step, SIMULATED_PROGRESS_CAP);
      });
    }, SIMULATED_PROGRESS_INTERVAL_MS);
  }, []);

  const pollJob = useCallback((jobId: string) => {
    pollHandle.current = setInterval(async () => {
      const response = await getJobStatus(jobId);

      if (!response.success || !response.data) {
        stopPolling();
        setStatus("failed");
        setErrorMessage(response.error ?? "Could not check job status.");
        return;
      }

      const {
        status: jobStatus,
        resultUrl: url,
        resultText: text,
        error,
      } = response.data;

      if (jobStatus === "completed") {
        stopPolling();
        setProgress(100);
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
    async (
      endpoint: string,
      files: File[],
      options?: Record<string, string>,
    ) => {
      setStatus("uploading");
      setErrorMessage(null);
      setResultUrl(null);
      setResultText(null);
      startSimulatedProgress();

      const response = await submitToolJob(endpoint, files, options);
      stopSimulatedProgress();

      if (!response.success || !response.data) {
        setStatus("failed");
        setProgress(0);
        setErrorMessage(response.error ?? "Upload failed.");
        return;
      }

      setStatus("processing");
      pollJob(response.data.jobId);
    },
    [pollJob, startSimulatedProgress],
  );

  const runPromptJob = useCallback(
    async (
      endpoint: string,
      prompt: string,
      options?: Record<string, string>,
    ) => {
      setStatus("uploading");
      setErrorMessage(null);
      setResultUrl(null);
      setResultText(null);
      startSimulatedProgress();

      const response = await submitPromptJob(endpoint, prompt, options);
      stopSimulatedProgress();

      if (!response.success || !response.data) {
        setStatus("failed");
        setProgress(0);
        setErrorMessage(response.error ?? "Request failed.");
        return;
      }

      setStatus("processing");
      pollJob(response.data.jobId);
    },
    [pollJob, startSimulatedProgress],
  );

  const reset = useCallback(() => {
    stopPolling();
    stopSimulatedProgress();
    setStatus("idle");
    setProgress(0);
    setResultUrl(null);
    setResultText(null);
    setErrorMessage(null);
  }, []);

  return {
    status,
    progress,
    resultUrl,
    resultText,
    errorMessage,
    runFileJob,
    runPromptJob,
    reset,
  };
}
