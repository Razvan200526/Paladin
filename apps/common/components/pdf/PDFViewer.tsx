import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { cn } from '@heroui/react';
import { useCallback, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const PdfViewer = ({
  src,
  toolbar = false,
  initialPage = 1,
  className,
  render,
}: {
  src: string;
  toolbar?: boolean;
  initialPage?: number;
  className?: string;
  render?: () => { endPage: number; startPage: number };
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(initialPage);
  const [scale, setScale] = useState(1.0);

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    [],
  );

  const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setPageNumber((prev) => Math.min(prev + 1, numPages || prev));
  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));

  const pagesToRender: number[] = [];
  if (render) {
    const { startPage, endPage } = render();
    for (let i = startPage; i <= endPage && i <= (numPages || endPage); i++) {
      pagesToRender.push(i);
    }
  } else if (numPages) {
    for (let i = 1; i <= numPages; i++) {
      pagesToRender.push(i);
    }
  }

  return (
    <div
      className={cn(
        'h-full w-full relative bg-light overflow-auto',
        toolbar ? 'pt-14' : 'pt-0',
        className,
      )}
    >
      {toolbar && (
        <div className="justify-center w-fit m-auto rounded absolute top-2 left-0 right-0 z-50 hidden md:flex bg-white/90 shadow-md">
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={zoomOut}
              className="px-2 py-1 rounded hover:bg-gray-200"
              type="button"
            >
              -
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button
              onClick={zoomIn}
              className="px-2 py-1 rounded hover:bg-gray-200"
              type="button"
            >
              +
            </button>
            <div className="w-px h-6 bg-gray-300 mx-2" />
            <button
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
              className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
              type="button"
            >
              ←
            </button>
            <span className="text-sm">
              {pageNumber} / {numPages || '?'}
            </span>
            <button
              onClick={goToNextPage}
              disabled={pageNumber >= (numPages || 1)}
              className="px-2 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
              type="button"
            >
              →
            </button>
          </div>
        </div>
      )}

      <Document
        file={src}
        onLoadSuccess={onDocumentLoadSuccess}
        className="flex flex-col items-center gap-4 p-4"
      >
        {pagesToRender.length > 0 ? (
          pagesToRender.map((page) => (
            <Page
              key={page}
              pageNumber={page}
              scale={scale}
              className="shadow-lg"
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          ))
        ) : (
          <Page
            pageNumber={pageNumber}
            scale={scale}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        )}
      </Document>
    </div>
  );
};
