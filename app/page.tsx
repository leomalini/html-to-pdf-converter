"use client";
import { ActionButtons } from "@/components/action-buttons";
import { PageEditor } from "@/components/page-editor";
import { PageTabs } from "@/components/page-tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHtmlPages } from "@/hooks/use-html-pages";
import { usePdfConversion } from "@/hooks/use-pdf-conversion";

export default function HtmlToPdfConverter() {
  const {
    pages,
    activePage,
    activePageId,
    setActivePageId,
    handleAddPage,
    handleDeletePage,
    handleUpdatePageHtml,
    sortedPages,
  } = useHtmlPages();

  const { pdfUrl, isConverting, handleConvert } = usePdfConversion(pages);

  return (
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Convertor de HTML para PDF
      </h1>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Converta HTML para PDF</CardTitle>
          <CardDescription>
            Crie múltiplas páginas HTML e converta-as para um único documento
            PDF
          </CardDescription>
        </CardHeader>

        <CardContent>
          <PageTabs
            pages={sortedPages}
            activePageId={activePageId}
            setActivePageId={setActivePageId}
            onAddPage={handleAddPage}
            onDeletePage={handleDeletePage}
          />

          <PageEditor
            html={activePage.html}
            onChange={(value) => handleUpdatePageHtml(activePage.id, value)}
          />
        </CardContent>

        <CardFooter className="flex gap-4">
          <ActionButtons
            pdfUrl={pdfUrl}
            isConverting={isConverting}
            onConvert={handleConvert}
            hasEmptyPages={pages.some((page) => !page.html.trim())}
          />
        </CardFooter>
      </Card>
    </main>
  );
}
