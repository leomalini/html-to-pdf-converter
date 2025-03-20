"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Download } from "lucide-react";

interface ActionButtonsProps {
  pdfUrl: string | null;
  isConverting: boolean;
  onConvert: () => Promise<void>;
  hasEmptyPages: boolean;
}

export function ActionButtons({
  pdfUrl,
  isConverting,
  onConvert,
  hasEmptyPages,
}: ActionButtonsProps) {
  const handleDownload = () => {
    if (!pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = "document.pdf";
    a.click();
  };

  return (
    <>
      <Button onClick={onConvert} disabled={isConverting || hasEmptyPages}>
        {isConverting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Convertendo...
          </>
        ) : (
          "Converter para PDF"
        )}
      </Button>

      {pdfUrl && (
        <Button
          variant="outline"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download size={16} />
          Download PDF
        </Button>
      )}
    </>
  );
}
