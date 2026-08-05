import { apiClient, handleApiCall } from "@/lib/api/client";
import { JobStatusPayload, UploadResponsePayload } from "@/lib/types/api.types";

export async function submitToolJob(endpoint: string, files: File[], options?: Record<string, string>) {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  if (options) {
    Object.entries(options).forEach(([key, value]) => formData.append(key, value));
  }

  return handleApiCall<UploadResponsePayload>(apiClient.post(endpoint, formData));
}

export async function submitPromptJob(endpoint: string, prompt: string, options?: Record<string, string>) {
  return handleApiCall<UploadResponsePayload>(
    apiClient.post(endpoint, { prompt, ...options })
  );
}

export async function getJobStatus(jobId: string) {
  return handleApiCall<JobStatusPayload>(apiClient.get(`/jobs/${jobId}`));
}
