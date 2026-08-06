import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ResultDownloadProps {
  resultUrl: string | null;
  resultText: string | null;
  onReset: () => void;
}

export function ResultDownload({
  resultUrl,
  resultText,
  onReset,
}: ResultDownloadProps) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-mint/30 bg-mint/5 p-6">
      <p className="text-sm text-text-primary">Your file is ready.</p>

      {resultText && (
        <pre className="mt-4 max-h-64 overflow-auto whitespace-pre-wrap rounded-[var(--radius-sm)] border border-border bg-ink p-4 font-mono text-xs text-text-secondary">
          {resultText}
        </pre>
      )}

      <div className="mt-4 flex gap-3">
        {resultUrl && (
          <a href={resultUrl} download>
            <Button variant="primary">
              <Download size={14} />
              Download
            </Button>
          </a>
        )}
        <Button variant="ghost" onClick={onReset}>
          Start another
        </Button>
      </div>
    </div>
  );
}
