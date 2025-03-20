"use client";

import { Button } from "@/components/ui/button";
import type { PageData } from "@/types/page";
import { Plus, Trash2 } from "lucide-react";

interface PageTabsProps {
  pages: PageData[];
  activePageId: string;
  setActivePageId: (id: string) => void;
  onAddPage: () => void;
  onDeletePage: (id: string) => void;
}

export function PageTabs({
  pages,
  activePageId,
  setActivePageId,
  onAddPage,
  onDeletePage,
}: PageTabsProps) {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex overflow-x-auto pb-2 gap-2">
        {pages.map((page, idx) => (
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
                onClick={() => onDeletePage(page.id)}
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
        onClick={onAddPage}
        className="flex items-center gap-1"
      >
        <Plus size={16} />
        Adicionar página
      </Button>
    </div>
  );
}
