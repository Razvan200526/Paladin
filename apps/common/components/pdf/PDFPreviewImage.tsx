import { PdfIcon } from '@common/icons/PdfIcon';
import { Image } from '@heroui/react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import { useEffect, useRef, useState } from 'react';

const workerSrc =
  'https://unpkg.com/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs';
GlobalWorkerOptions.workerSrc = workerSrc;

export const PdfPreviewImage = ({ src }: { src: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const pdfDocRef = useRef<PDFDocumentProxy | null>(null);

  useEffect(() => {
    if (!src) return;

    let isCancelled = false;

    async function renderFirstPage() {
      // Cancel any previous render task
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancel errors
        }
        renderTaskRef.current = null;
      }

      // Destroy previous PDF document
      if (pdfDocRef.current) {
        try {
          await pdfDocRef.current.destroy();
        } catch {
          // Ignore destroy errors
        }
        pdfDocRef.current = null;
      }

      try {
        const loadingTask = getDocument(src);
        const pdf = await loadingTask.promise;

        if (isCancelled) {
          await pdf.destroy();
          return;
        }

        pdfDocRef.current = pdf;
        const page = await pdf.getPage(1);

        if (isCancelled) {
          return;
        }

        const scale = 2;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;

        if (!canvas || isCancelled) {
          return;
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const context = canvas.getContext('2d');
        if (!context) {
          return;
        }

        const renderTask = page.render({
          canvasContext: context,
          viewport,
          canvas,
        });

        renderTaskRef.current = renderTask;

        await renderTask.promise;

        if (isCancelled) {
          return;
        }

        const dataUrl = canvas.toDataURL('image/png');
        setImageUrl(dataUrl);
      } catch (error) {
        // Ignore cancellation errors
        if (error instanceof Error && error.message.includes('cancelled')) {
          return;
        }
        console.error('PDF preview render error:', error);
      }
    }

    renderFirstPage();

    return () => {
      isCancelled = true;

      // Cancel render task on cleanup
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Ignore cancel errors
        }
        renderTaskRef.current = null;
      }

      // Destroy PDF document on cleanup
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy().catch(() => {
          // Ignore destroy errors
        });
        pdfDocRef.current = null;
      }
    };
  }, [src]);

  return (
    <div className="h-full w-full">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {imageUrl ? (
        <Image
          src={imageUrl}
          className="max-h-full max-w-full object-contain"
          classNames={{
            wrapper: 'h-full w-full flex items-center justify-center',
            img: 'max-h-full max-w-full object-contain',
          }}
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <PdfIcon className="size-10 text-primary" />
        </div>
      )}
    </div>
  );
};
