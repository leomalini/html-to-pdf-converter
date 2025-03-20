"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language = "html",
}: CodeEditorProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <Editor
      height="100%"
      language={language}
      value={value}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
        lineNumbers: "on",
        automaticLayout: true,
      }}
      theme="vs-dark"
    />
  );
}
