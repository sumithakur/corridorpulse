import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided." }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Dynamic import to keep server bundle clean
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
    const path = await import("path");
    const { pathToFileURL } = await import("url");
    const workerPath = pathToFileURL(path.join(process.cwd(), "node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs")).href;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerPath;

    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let extractedText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item) => ("str" in item ? (item as { str: string }).str : ""))
        .join(" ");
      extractedText += `--- Page ${pageNum} ---\n${pageText}\n\n`;
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { 
          error: "Could not extract readable text from PDF. The file might contain only images/scanned graphics without selectable text." 
        },
        { status: 422 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      text: extractedText.trim(), 
      pages: pdf.numPages 
    });
  } catch (err: unknown) {
    console.error("Error in /api/parse-pdf:", err);
    const errorMsg = err instanceof Error ? err.message : "Failed to parse PDF document on server.";
    return NextResponse.json(
      { error: errorMsg },
      { status: 500 }
    );
  }
}
