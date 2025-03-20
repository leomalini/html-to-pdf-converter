"use client";

import CodeEditor from "@/components/code-editor";

interface PageEditorProps {
  html: string;
  onChange: (value: string) => void;
}

export function PageEditor({ html, onChange }: PageEditorProps) {
  return (
    <div className="border rounded-md overflow-hidden h-[400px]">
      <CodeEditor value={html} onChange={onChange} language="html" />
    </div>
  );
}
