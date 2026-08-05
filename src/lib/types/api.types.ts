export interface ApiResponse<T> {
  success: boolean;
  error: string | null;
  sessionExpired?: boolean;
  data: T | null;
}

export interface UploadResponsePayload {
  jobId: string;
  fileKey: string;
}

export interface JobStatusPayload {
  jobId: string;
  status: "queued" | "processing" | "completed" | "failed";
  progress: number;
  resultUrl?: string;
  resultText?: string;
  error?: string;
}
