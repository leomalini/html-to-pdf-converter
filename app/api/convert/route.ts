import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "HTML content is required" },
        { status: 400 }
      );
    }

    // Create a simple HTML document with proper structure and page breaks
    const fullHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>PDF Document</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              line-height: 1.5;
            }
            .page-break {
              page-break-after: always;
              break-after: page;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Use the HTML to PDF API service
    const apiKey = process.env.HTML_PDF_API_KEY;
    if (!apiKey) {
      console.error("HTML_PDF_API_KEY environment variable is not set");
      return NextResponse.json(
        { error: "API key configuration error" },
        { status: 500 }
      );
    }
    const response = await fetch("https://api.html2pdf.app/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        html: fullHtml,
        apiKey: apiKey,
        options: {
          pageSize: "A4",
          marginTop: "20mm",
          marginBottom: "20mm",
          marginLeft: "20mm",
          marginRight: "20mm",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} ${errorText}`);
    }

    // Get the PDF as a buffer
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="document.pdf"',
      },
    });
  } catch (error) {
    console.error("PDF conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert HTML to PDF" },
      { status: 500 }
    );
  }
}
