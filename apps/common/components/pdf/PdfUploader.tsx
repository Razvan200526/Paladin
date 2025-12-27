import { PdfIcon } from '@common/icons/PdfIcon';
import { cn, Progress, ScrollShadow } from '@heroui/react';
import {
  useAddCoverLetter,
  useCreateResume,
} from '@ruby/resources/resumes/hooks';
import { useAuth } from '@ruby/shared/hooks';
import * as React from 'react';
import { useState } from 'react';
import { Button } from '../button';
import { Toast } from '../toast';
import { PdfPreviewImage } from './PDFPreviewImage';

let timeout: any = null;

export type PdfUploaderProps = React.HTMLAttributes<HTMLDivElement> & {
  onUpload?: (urls: string[], size: number) => void;
  maxSize?: number; // in bytes
  accept?: string[];
  loading?: boolean;
  autoUpload?: boolean;
  endpoint?: string;
  multiple?: boolean;
  type: 'resume' | 'coverLetter';
};

export const PdfUploader = React.forwardRef<HTMLDivElement, PdfUploaderProps>(
  (
    {
      className,
      onUpload,
      maxSize = 10 * 1000 * 1024 * 1024, // 10GB default
      accept = ['application/pdf'],
      loading = false,
      autoUpload = true,
      endpoint,
      multiple = true,
      type,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { data: user } = useAuth();
    const { mutateAsync: addResume } = useCreateResume(user?.id || '');
    const { mutateAsync: addCoverLetter } = useAddCoverLetter(user?.id || '');
    if (!user || !user.id) {
      Toast.error({ description: 'Please login to upload files' });
      return null;
    }

    const handleDragEnter = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFiles(files);
      }
    };

    const validateFile = (file: File): boolean => {
      if (!accept.includes(file.type)) {
        setErrorMessage('File type not supported');
        return false;
      }

      if (file.size > maxSize) {
        setErrorMessage('File size exceeds limit');
        return false;
      }

      setErrorMessage(null);

      return true;
    };

    const handleFiles = (files: File[]) => {
      const validFiles = files.filter(validateFile);
      if (validFiles.length === 0) return;
      setSelectedFiles(validFiles);
      savePdf(validFiles);
    };

    const savePdf = async (files: File[]) => {
      clearTimeout(timeout);
      setIsLoading(true);
      timeout = setTimeout(async () => {
        try {
          const uploadPromises = files.map(async (file) => {
            if (type === 'resume') {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('userId', user.id);
              formData.append('name', file.name);
              const data = await addResume(formData);
              if (data.success) {
                Toast.success({ description: 'Resume uploaded successfully' });
                return data.data.url;
              }
            }

            if (type === 'coverLetter') {
              const formData = new FormData();
              formData.append('file', file);
              formData.append('userId', user.id);
              formData.append('name', file.name);
              const data = await addCoverLetter(formData);
              if (data.success) {
                Toast.success({
                  description: 'Cover Letter uploaded successfully',
                });
              }
              return data.data.url;
            }
          });

          const urls = await Promise.all(uploadPromises);

          setTimeout(() => {
            setIsLoading(false);
            onUpload?.(
              urls as string[],
              files.reduce((total, file) => total + file.size / 1024, 0),
            );
          }, 500);
        } catch (_e) {
          setIsLoading(false);
          setErrorMessage('Upload failed. Please try again.');
        }
      }, 1000);
    };

    return (
      <div className="flex flex-col items-end gap-8 w-full">
        {selectedFiles.length > 0 ? (
          <ScrollShadow className="w-full h-100 p-2" size={8}>
            <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2 w-full">
              {selectedFiles.map((file) => (
                <li
                  key={file.name}
                  className="h-62.5 w-full border border-border rounded p-0 flex items-center justify-center"
                >
                  <PdfPreviewImage src={URL.createObjectURL(file)} />
                </li>
              ))}
            </ul>
          </ScrollShadow>
        ) : (
          <div
            ref={ref}
            className={cn(
              'relative flex flex-col items-center justify-center w-full p-2 py-10 max-h-125 overflow-auto',
              'border-2 border-dashed rounded transition-all duration-200 cursor-pointer',
              isDragging
                ? 'border-border-hover bg-primary-50'
                : 'border-primary/15 hover:border-border-hover',
              loading ? 'opacity-50 cursor-not-allowed' : '',
              className,
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            {...props}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={accept.join(',')}
              multiple={multiple}
              onChange={(e) => {
                handleFiles(Array.from(e.target.files || []));
              }}
              disabled={loading}
            />

            <div className="flex flex-col items-center gap-2 text-center">
              <PdfIcon className="text-primary/50 size-10" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-primary flex items-center gap-2">
                  <span>Drop your PDFs here, or</span>
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() => fileInputRef.current?.click()}
                  >
                    Browse
                  </Button>
                </span>
                <span className="text-xs font-medium text-primary/40">
                  Max size : {maxSize / (1024 * 1024)}MB
                </span>
              </div>
            </div>
          </div>
        )}

        {errorMessage ? (
          <div className="text-xs font-medium text-error">{errorMessage}</div>
        ) : null}
        {isLoading ? (
          <div className="p-2 w-full">
            <Progress
              size="sm"
              aria-label="progress"
              isIndeterminate={true}
              classNames={{
                base: 'w-full',
                track: 'bg-border-hover/30',
                indicator: 'bg-gradient-to-b from-border-hover to-primary-950',
              }}
            />
          </div>
        ) : null}
      </div>
    );
  },
);
