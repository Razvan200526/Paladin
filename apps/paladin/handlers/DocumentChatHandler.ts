/**
 * Document Chat Handler
 * Handles WebSocket connections for resume and cover letter AI chat
 */

import { AiQueryService } from '@paladin/services/AiMessageService';
import { DocumentTextService } from '@paladin/services/DocumentTextService';
import { CoverletterRepository } from '@paladin/repositories/CoverletterRepository';
import { ResumeRepository } from '@paladin/repositories/ResumeRepository';
import {
  inject,
  logger,
  onClose,
  onMessage,
  onOpen,
  websocket,
} from '@razvan11/paladin';
import type { ServerWebSocket } from 'bun';

interface WSData {
  path: string;
  documentId?: string;
  documentType?: 'resume' | 'coverletter';
  documentText?: string;
}

interface ChatPayload {
  channelName: 'resume:chat' | 'coverletter:chat';
  data: {
    resumeId?: string;
    coverletterId?: string;
    query: string;
  };
}

interface ChatResponse {
  channelName: string;
  data: {
    pages: number[];
    text: string;
    status: 'progress' | 'completed' | 'error';
  };
  message: string | null;
  success: boolean;
  status: number;
  isClientError: boolean;
  isServerError: boolean;
  isNotFound: boolean;
  isUnauthorized: boolean;
  isForbidden: boolean;
  isLocal: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
  debug: boolean;
  app: {
    url: string;
  };
}

@websocket('/ws/document-chat')
export class DocumentChatHandler {
  constructor(
    @inject(AiQueryService) private aiService: AiQueryService,
    @inject(DocumentTextService) private documentService: DocumentTextService,
    @inject(ResumeRepository) private resumeRepo: ResumeRepository,
    @inject(CoverletterRepository)
    private coverletterRepo: CoverletterRepository,
  ) {}

  @onOpen()
  handleOpen(_ws: ServerWebSocket<WSData>) {
    logger.info('[Document Chat] Client connected');
  }

  @onMessage()
  async handleMessage(ws: ServerWebSocket<WSData>, message: string | Buffer) {
    const messageStr =
      typeof message === 'string' ? message : message.toString();

    try {
      const payload: ChatPayload = JSON.parse(messageStr);
      const { channelName, data } = payload;

      if (channelName === 'resume:chat') {
        if (!data.resumeId) {
          this.sendError(ws, channelName, 'resumeId is required');
          return;
        }
        await this.handleResumeChat(ws, data.resumeId, data.query);
      } else if (channelName === 'coverletter:chat') {
        if (!data.coverletterId) {
          this.sendError(ws, channelName, 'coverletterId is required');
          return;
        }
        await this.handleCoverletterChat(ws, data.coverletterId, data.query);
      } else {
        this.sendError(ws, channelName, 'Unknown channel');
      }
    } catch (error) {
      logger.error(new Error(`[Document Chat] Error: ${error}`));
      this.sendError(
        ws,
        'unknown',
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @onClose()
  handleClose(_ws: ServerWebSocket<WSData>) {
    logger.info('[Document Chat] Client disconnected');
  }

  private async handleResumeChat(
    ws: ServerWebSocket<WSData>,
    resumeId: string,
    query: string,
  ) {
    const channelName = 'resume:chat';

    if (!resumeId || !query) {
      this.sendError(ws, channelName, 'resumeId and query are required');
      return;
    }

    try {
      // Fetch the resume
      const resume = await this.resumeRepo.findOne(resumeId);
      if (!resume) {
        this.sendNotFound(ws, channelName, 'Resume not found');
        return;
      }

      // Extract text from the resume document
      let documentText = ws.data.documentText;
      let pages: number[] = [];

      if (!documentText || ws.data.documentId !== resumeId) {
        const extracted = await this.documentService.extractText(
          resume.url,
          resume.filetype,
        );
        documentText = extracted.text;
        pages = extracted.pages;

        // Cache for subsequent queries
        ws.data.documentId = resumeId;
        ws.data.documentType = 'resume';
        ws.data.documentText = documentText;
      }

      // Stream AI response
      await this.streamAiResponse(ws, channelName, query, documentText, pages);
    } catch (error) {
      logger.error(new Error(`[Resume Chat] Error: ${error}`));
      this.sendError(
        ws,
        channelName,
        error instanceof Error ? error.message : 'Failed to process resume',
      );
    }
  }

  private async handleCoverletterChat(
    ws: ServerWebSocket<WSData>,
    coverletterId: string,
    query: string,
  ) {
    const channelName = 'coverletter:chat';

    if (!coverletterId || !query) {
      this.sendError(ws, channelName, 'coverletterId and query are required');
      return;
    }

    try {
      // Fetch the cover letter
      const coverletter = await this.coverletterRepo.findOne(coverletterId);
      if (!coverletter) {
        this.sendNotFound(ws, channelName, 'Cover letter not found');
        return;
      }

      // Extract text from the cover letter document
      let documentText = ws.data.documentText;
      let pages: number[] = [];

      if (!documentText || ws.data.documentId !== coverletterId) {
        const extracted = await this.documentService.extractText(
          coverletter.url,
          coverletter.filetype,
        );
        documentText = extracted.text;
        pages = extracted.pages;

        // Cache for subsequent queries
        ws.data.documentId = coverletterId;
        ws.data.documentType = 'coverletter';
        ws.data.documentText = documentText;
      }

      // Stream AI response
      await this.streamAiResponse(ws, channelName, query, documentText, pages);
    } catch (error) {
      logger.error(new Error(`[Coverletter Chat] Error: ${error}`));
      this.sendError(
        ws,
        channelName,
        error instanceof Error
          ? error.message
          : 'Failed to process cover letter',
      );
    }
  }

  private async streamAiResponse(
    ws: ServerWebSocket<WSData>,
    channelName: string,
    query: string,
    documentText: string,
    pages: number[],
  ) {
    const systemPrompt = `You are analyzing a document (resume or cover letter). Here is the document content:

---
${documentText}
---

Answer the user's question based on this document. Be specific and reference the content when relevant.`;

    let fullText = '';

    await this.aiService.streamResponse(
      `${systemPrompt}\n\nUser question: ${query}`,
      (chunk) => {
        if (chunk.type === 'token') {
          fullText += chunk.content;

          // Send progress update
          const response = this.buildResponse(channelName, {
            pages,
            text: chunk.content,
            status: 'progress',
          });
          ws.send(JSON.stringify(response));
        } else if (chunk.type === 'complete') {
          // Send completion
          const response = this.buildResponse(channelName, {
            pages,
            text: fullText,
            status: 'completed',
          });
          ws.send(JSON.stringify(response));
        } else if (chunk.type === 'error') {
          this.sendError(ws, channelName, chunk.content);
        }
      },
      [], // No prior context
    );
  }

  private buildResponse(
    channelName: string,
    data: {
      pages: number[];
      text: string;
      status: 'progress' | 'completed' | 'error';
    },
    options: Partial<ChatResponse> = {},
  ): ChatResponse {
    return {
      channelName,
      data,
      message: options.message ?? null,
      success: options.success ?? true,
      status: options.status ?? 200,
      isClientError: options.isClientError ?? false,
      isServerError: options.isServerError ?? false,
      isNotFound: options.isNotFound ?? false,
      isUnauthorized: options.isUnauthorized ?? false,
      isForbidden: options.isForbidden ?? false,
      isLocal: process.env.NODE_ENV === 'development',
      isDevelopment: process.env.NODE_ENV === 'development',
      isStaging: process.env.NODE_ENV === 'staging',
      isProduction: process.env.NODE_ENV === 'production',
      debug: process.env.NODE_ENV !== 'production',
      app: {
        url: process.env.APP_URL || 'http://localhost:3000',
      },
    };
  }

  private sendError(
    ws: ServerWebSocket<WSData>,
    channelName: string,
    message: string,
  ) {
    const response = this.buildResponse(
      channelName,
      { pages: [], text: message, status: 'error' },
      {
        message,
        success: false,
        status: 500,
        isServerError: true,
      },
    );
    ws.send(JSON.stringify(response));
  }

  private sendNotFound(
    ws: ServerWebSocket<WSData>,
    channelName: string,
    message: string,
  ) {
    const response = this.buildResponse(
      channelName,
      { pages: [], text: message, status: 'error' },
      {
        message,
        success: false,
        status: 404,
        isNotFound: true,
      },
    );
    ws.send(JSON.stringify(response));
  }
}
