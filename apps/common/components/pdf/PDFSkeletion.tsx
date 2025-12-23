import { PdfIcon } from '@common/icons/PdfIcon';

interface PDFPreviewSkeletonProps {
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
}

export const PDFPreviewSkeleton = ({
  className = '',
  showIcon = true,
  showText = true,
}: PDFPreviewSkeletonProps) => {
  return (
    <div
      className={`h-full w-full flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg ${className}`}
    >
      <div className="flex flex-col items-center space-y-4 p-8">
        {/* PDF Icon with pulse animation */}
        {showIcon && (
          <div className="animate-pulse">
            <PdfIcon className="size-12 text-gray-300 dark:text-gray-600" />
          </div>
        )}

        {/* Shimmer bars representing document content */}
        <div className="space-y-3 w-48">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-4/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-3/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-5/6" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-2/6" />
        </div>

        {/* Loading text */}
        {showText && (
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Loading PDF preview...
          </p>
        )}

        {/* Additional decorative elements */}
        <div className="flex space-x-2 mt-2">
          <div className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce" />
          <div
            className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: '0.1s' }}
          />
          <div
            className="w-2 h-2 bg-gray-300 dark:bg-gray-600 rounded-full animate-bounce"
            style={{ animationDelay: '0.2s' }}
          />
        </div>
      </div>
    </div>
  );
};
