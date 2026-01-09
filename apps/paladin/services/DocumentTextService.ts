/**
 * Document Text Service
 * Extracts text content from PDF documents for AI chat context
 */

import { inject, service } from '@razvan11/paladin';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

@service()
export class DocumentTextService {
  constructor(@inject('R2_ACCESS_KEY') private readonly _accessKey: string) {}

  /**
   * Fetch and extract text from a PDF document URL
   */
  async extractTextFromUrl(url: string): Promise<{
    text: string;
    pages: number[];
    pageCount: number;
  }> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      return this.extractTextFromBuffer(arrayBuffer);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to extract text from URL: ${message}`);
    }
  }

  /**
   * Extract text from a PDF buffer
   */
  async extractTextFromBuffer(buffer: ArrayBuffer): Promise<{
    text: string;
    pages: number[];
    pageCount: number;
  }> {
    try {
      const data = new Uint8Array(buffer);

      const loadingTask = pdfjsLib.getDocument({
        data,
        useSystemFonts: true,
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;
      const pageCount = pdf.numPages;
      const pages: number[] = [];
      const textParts: string[] = [];

      for (let pageNum = 1; pageNum <= pageCount; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => {
            if ('str' in item) {
              return item.str;
            }
            return '';
          })
          .join(' ')
          .trim();

        if (pageText) {
          textParts.push(`--- Page ${pageNum} ---\n${pageText}`);
          pages.push(pageNum);
        }
      }

      return {
        text: textParts.join('\n\n'),
        pages,
        pageCount,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to parse PDF: ${message}`);
    }
  }

  /**
   * Extract text based on file type
   */
  async extractText(
    url: string,
    filetype?: string,
  ): Promise<{
    text: string;
    pages: number[];
    pageCount: number;
  }> {
    const isPdf =
      filetype?.includes('pdf') ||
      url.toLowerCase().endsWith('.pdf') ||
      filetype === 'application/pdf';

    if (isPdf) {
      return this.extractTextFromUrl(url);
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch document: ${response.statusText}`);
      }

      const text = await response.text();
      return {
        text,
        pages: [1],
        pageCount: 1,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Failed to extract text: ${message}`);
    }
  }
}
