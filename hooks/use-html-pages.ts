"use client";

import type { PageData } from "@/types/page";
import { useState, useMemo } from "react";

export function useHtmlPages() {
  const [pages, setPages] = useState<PageData[]>([
    {
      id: "page-1",
      html: "<h1>Hello World</h1>\n<p>This is page 1.</p>",
      index: 1,
    },
  ]);
  const [activePageId, setActivePageId] = useState("page-1");
  const [nextPageIndex, setNextPageIndex] = useState(2);

  const handleAddPage = () => {
    const newPageId = `page-${Date.now()}`;
    const newPage = {
      id: newPageId,
      html: ``,
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

  // Sort pages by index for display
  const sortedPages = useMemo(() => {
    return [...pages].sort((a, b) => a.index - b.index);
  }, [pages]);

  // Get the active page
  const activePage = useMemo(() => {
    return pages.find((page) => page.id === activePageId) || pages[0];
  }, [pages, activePageId]);

  return {
    pages,
    activePage,
    activePageId,
    setActivePageId,
    handleAddPage,
    handleDeletePage,
    handleUpdatePageHtml,
    sortedPages,
  };
}
