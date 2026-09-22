import { useState } from "react";

import { Skeleton } from "@/components/ui/skeleton";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { DocumentCallback } from "react-pdf/dist/shared/types.js";

// Serve the worker from public/ (copied there from react-pdf's own pdfjs-dist)
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface PdfViewerProps {
  file: File;
  width?: number;
}

export const PdfViewer = ({ file, width }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>();

  function onDocumentLoadSuccess(document: DocumentCallback): void {
    setNumPages(document.numPages);
  }
  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
      options={options}
      loading={<Skeleton className="w-full h-80" />}
    >
      {Array.from(new Array(numPages), (el, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          renderTextLayer={false}
          className="max-w-full aspect-auto"
          width={width}
        />
      ))}
    </Document>
  );
};
