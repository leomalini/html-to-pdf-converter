"use client";

import type { PageData } from "@/types/page";
import { useState } from "react";

export function usePdfConversion(pages: PageData[]) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleConvert = async () => {
    try {
      setIsConverting(true);

      // Sort pages by index and concatenate all HTML
      const sortedPages = [...pages].sort((a, b) => a.index - b.index);
      const combinedHtml = sortedPages
        .map((page) => {
          // Add page break after each page except the last one
          if (page.index < sortedPages.length) {
            return `${page.html}\n<div class="page-break"></div>`;
          }
          return page.html;
        })
        .join("\n");

      // Call our API endpoint
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ html: combinedHtml }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get the PDF as a blob
      const pdfBlob = await response.blob();
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (error) {
      console.error("Error converting to PDF:", error);
      alert("Failed to convert HTML to PDF. Please try again.");
    } finally {
      setIsConverting(false);
    }
  };

  return {
    pdfUrl,
    isConverting,
    handleConvert,
  };
}
