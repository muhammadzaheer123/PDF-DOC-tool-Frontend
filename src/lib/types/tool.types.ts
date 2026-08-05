export type ToolCategory = "pdf" | "ai";

export type ToolInputType = "single-file" | "multi-file" | "text-prompt";

export type AcceptedFileType = "pdf" | "image" | "docx";

export interface ToolDefinition {
  slug: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  inputType: ToolInputType;
  acceptedFileTypes: AcceptedFileType[];
  maxFiles: number;
  requiresAiKey: boolean;
  requiresPassword?: boolean;
  endpoint: string;
  icon: string;
}

export type JobStatus = "idle" | "uploading" | "queued" | "processing" | "completed" | "failed";

export interface JobResult {
  jobId: string;
  status: JobStatus;
  progress: number;
  resultUrl?: string;
  resultText?: string;
  error?: string;
}
