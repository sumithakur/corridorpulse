"use client";

/**
 * Extracts plain text from a PDF file using the high-performance,
 * server-side parser route (/api/parse-pdf), avoiding browser web-worker
 * cross-origin and dynamic import issues.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse-pdf", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to extract text from PDF.");
    }

    if (!data.text || !data.text.trim()) {
      throw new Error("Could not extract readable text from PDF. The file may be image-only, scanned, or empty.");
    }

    return data.text.trim();
  } catch (err: unknown) {
    console.error("PDF Extraction error:", err);
    const errMsg = err instanceof Error ? err.message : "Failed to parse text from PDF.";
    throw new Error(errMsg);
  }
}
