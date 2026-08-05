"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { AcceptedFileType } from "@/lib/types/tool.types";
import { formatBytes } from "@/lib/utils/formatBytes";
import { cn } from "@/lib/utils/cn";

const MIME_MAP: Record<AcceptedFileType, string> = {
  pdf: "application/pdf",
  image: "image/*",
  docx: ".docx",
};

interface FileUploaderProps {
  acceptedFileTypes: AcceptedFileType[];
  maxFiles: number;
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export function FileUploader({ acceptedFileTypes, maxFiles, files, onFilesChange }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const acceptAttr = acceptedFileTypes.map((type) => MIME_MAP[type]).join(",");

  const addFiles = useCallback(
    (incoming: FileList | null) => {
      if (!incoming) return;
      const next = [...files, ...Array.from(incoming)].slice(0, maxFiles);
      onFilesChange(next);
    },
    [files, maxFiles, onFilesChange]
  );

  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-border bg-surface px-6 py-14 text-center transition-colors",
          isDragging && "border-signal bg-surface-2"
        )}
      >
        <UploadCloud size={28} className="text-signal" strokeWidth={1.5} />
        <div>
          <p className="text-sm text-text-primary">Drop files here, or click to browse</p>
          <p className="mt-1 text-xs text-text-muted">
            Accepts {acceptedFileTypes.join(", ")} · up to {maxFiles} file{maxFiles > 1 ? "s" : ""}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple={maxFiles > 1}
          accept={acceptAttr}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-[var(--radius-sm)] border border-border bg-surface px-4 py-2.5 text-sm"
            >
              <span className="truncate font-mono text-text-secondary">{file.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted">{formatBytes(file.size)}</span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-text-muted hover:text-danger"
                  aria-label={`Remove ${file.name}`}
                >
                  <X size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
