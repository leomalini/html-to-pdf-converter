"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Download, Plus, Trash2 } from "lucide-react";
import CodeEditor from "@/components/code-editor";

interface PageData {
  id: string;
  html: string;
  index: number;
}

export default function HtmlToPdfConverter() {
  const [pages, setPages] = useState<PageData[]>([
    {
      id: "page-1",
      html: "<h1>Hello World</h1>\n<p>This is page 1.</p>",
      index: 1,
    },
  ]);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [activePageId, setActivePageId] = useState("page-1");
  const [nextPageIndex, setNextPageIndex] = useState(2);

  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      html: `<h1>Page ${nextPageIndex}</h1>\n<p>This is page ${nextPageIndex}.</p>`,
      index: nextPageIndex,
    };
    setPages([...pages, newPage]);
    setActivePageId(newPageId);
    setNextPageIndex(nextPageIndex + 1);
  };

  const handleDeletePage = (pageId: string) => {
    if (pages.length <= 1) {
      return; // Don't allow deleting the last page
    }

    const pageIndex = pages.findIndex((page) => page.id === pageId);
    const newPages = pages.filter((page) => page.id !== pageId);

    // Update the active page if needed
    if (activePageId === pageId) {
      // If we're deleting the last page, set active to the new last page
      // Otherwise, keep the same position
      const newActiveIndex = Math.min(pageIndex, newPages.length - 1);
      setActivePageId(newPages[newActiveIndex].id);
    }

    setPages(newPages);
  };

  const handleUpdatePageHtml = (pageId: string, html: string) => {
    setPages(
      pages.map((page) => (page.id === pageId ? { ...page, html } : page))
    );
  };

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

  const activePage = pages.find((page) => page.id === activePageId) || pages[0];

  // Sort pages by index for display
  const sortedPages = [...pages].sort((a, b) => a.index - b.index);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        HTML to PDF Converter
      </h1>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Convert HTML to PDF</CardTitle>
          <CardDescription>
            Create multiple HTML pages and convert them to a single PDF document
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="flex overflow-x-auto pb-2 gap-2">
              {sortedPages.map((page, idx) => (
                <div key={page.id} className="flex items-center">
                  <Button
                    variant={activePageId === page.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActivePageId(page.id)}
                    className="whitespace-nowrap"
                  >
                    {`Page ${idx + 1}`}
                  </Button>
                  {pages.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletePage(page.id)}
                      className="h-8 w-8 ml-1"
                      title="Delete page"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddPage}
              className="flex items-center gap-1"
            >
              <Plus size={16} />
              Add Page
            </Button>
          </div>

          <div className="border rounded-md overflow-hidden h-[400px]">
            <CodeEditor
              value={activePage.html}
              onChange={(value) => handleUpdatePageHtml(activePage.id, value)}
              language="html"
            />
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          <Button
            onClick={handleConvert}
            disabled={isConverting || pages.some((page) => !page.html.trim())}
          >
            {isConverting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert to PDF"
            )}
          </Button>

          {pdfUrl && (
            <Button
              variant="outline"
              onClick={() => {
                const a = document.createElement("a");
                a.href = pdfUrl;
                a.download = "document.pdf";
                a.click();
              }}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Download PDF
            </Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
