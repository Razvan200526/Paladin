import { controller, del, get, inject, post } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import type { ApiResponse } from '../sdk/types';
import {
  AiChatSessionService,
  type ChatSession,
} from '../services/AiChatSessionService';

interface ChatHistoryItem {
  id: string;
  title: string;
  createdAt: Date;
  messageCount: number;
}

@controller('/api/chat-history')
export class ChatHistoryController {
  constructor(
    @inject(AiChatSessionService)
    private readonly sessionService: AiChatSessionService,
  ) {}

  /**
   * GET /api/chat-history/:userId
   * Get all chat sessions for a user
   */
  @get('/:userId')
  async getUserHistory(c: Context): Promise<ApiResponse<ChatHistoryItem[]>> {
    try {
      const userId = c.req.param('userId');

      const sessions = await this.sessionService.getUserSessions(userId);

      const history: ChatHistoryItem[] = sessions.map((s) => ({
        id: s.id,
        title: s.title,
        createdAt: s.createdAt,
        messageCount: s.messages.length,
      }));

      return apiResponse(c, {
        data: history,
        message: 'Chat history retrieved successfully',
      });
    } catch (e) {
      console.error('Get chat history error:', e);
      return apiResponse(
        c,
        {
          data: [],
          message: 'Failed to retrieve chat history',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * GET /api/chat-history/session/:sessionId
   * Get a single session with all messages
   */
  @get('/session/:sessionId')
  async getSession(c: Context): Promise<ApiResponse<ChatSession | null>> {
    try {
      const sessionId = c.req.param('sessionId');

      const session = await this.sessionService.getSession(sessionId);
      if (!session) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: session,
        message: 'Session retrieved successfully',
      });
    } catch (e) {
      console.error('Get session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve session',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/chat-history/create
   * Create a new chat session
   */
  @post('/create')
  async createSession(c: Context): Promise<ApiResponse<ChatSession | null>> {
    try {
      const { userId, title } = await c.req.json();

      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId is required',
            isClientError: true,
          },
          400,
        );
      }

      const session = await this.sessionService.createSession(userId, title);

      return apiResponse(
        c,
        {
          data: session,
          message: 'Session created successfully',
        },
        201,
      );
    } catch (e) {
      console.error('Create session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create session',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/chat-history/rename/:sessionId
   * Rename a chat session
   */
  @post('/rename/:sessionId')
  async renameSession(c: Context): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const sessionId = c.req.param('sessionId');
      const { title, userId } = await c.req.json();

      if (!title) {
        return apiResponse(
          c,
          {
            data: { success: false },
            message: 'title is required',
            isClientError: true,
          },
          400,
        );
      }

      const session = await this.sessionService.getSession(sessionId);
      if (!session) {
        return apiResponse(
          c,
          {
            data: { success: false },
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (session.userId !== userId) {
        return apiResponse(
          c,
          {
            data: { success: false },
            message: 'Unauthorized',
            isUnauthorized: true,
          },
          401,
        );
      }

      await this.sessionService.updateSessionTitle(sessionId, title);

      return apiResponse(c, {
        data: { success: true },
        message: 'Session renamed successfully',
      });
    } catch (e) {
      console.error('Rename session error:', e);
      return apiResponse(
        c,
        {
          data: { success: false },
          message: 'Failed to rename session',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * DELETE /api/chat-history/delete/:sessionId
   * Delete a chat session
   */
  @del('/delete/:sessionId')
  async deleteSession(c: Context): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const sessionId = c.req.param('sessionId');
      const userId = c.req.query('userId');

      const session = await this.sessionService.getSession(sessionId);
      if (!session) {
        return apiResponse(
          c,
          {
            data: { success: false },
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (session.userId !== userId) {
        return apiResponse(
          c,
          {
            data: { success: false },
            message: 'Unauthorized',
            isUnauthorized: true,
          },
          401,
        );
      }

      await this.sessionService.deleteSession(sessionId);

      return apiResponse(c, {
        data: { success: true },
        message: 'Session deleted successfully',
      });
    } catch (e) {
      console.error('Delete session error:', e);
      return apiResponse(
        c,
        {
          data: { success: false },
          message: 'Failed to delete session',
          isServerError: true,
        },
        500,
      );
    }
  }
}
