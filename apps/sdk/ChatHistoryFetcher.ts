import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export interface ChatHistoryItemType {
  id: string;
  title: string;
  createdAt: string;
  messageCount: number;
}

export interface ChatSessionType {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessageType[];
  createdAt: string;
  updatedAt?: string;
}

export interface ChatMessageType {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export class ChatHistoryFetcher {
  constructor(readonly fetcher: Fetcher) {}

  /**
   * Get all chat sessions for a user
   */
  public readonly getHistory = async (
    userId: string,
  ): Promise<ResponseType<ChatHistoryItemType[]>> => {
    return this.fetcher.get(`/api/chat-history/${userId}`);
  };

  /**
   * Get a single session with messages
   */
  public readonly getSession = async (
    sessionId: string,
  ): Promise<ResponseType<ChatSessionType>> => {
    return this.fetcher.get(`/api/chat-history/session/${sessionId}`);
  };

  /**
   * Create a new chat session
   */
  public readonly createSession = async (payload: {
    userId: string;
    title?: string;
  }): Promise<ResponseType<ChatSessionType>> => {
    return this.fetcher.post('/api/chat-history/create', payload);
  };

  /**
   * Rename a chat session
   */
  public readonly renameSession = async (payload: {
    sessionId: string;
    userId: string;
    title: string;
  }): Promise<ResponseType<{ success: boolean }>> => {
    return this.fetcher.post(`/api/chat-history/rename/${payload.sessionId}`, {
      userId: payload.userId,
      title: payload.title,
    });
  };

  /**
   * Delete a chat session
   */
  public readonly deleteSession = async (payload: {
    sessionId: string;
    userId: string;
  }): Promise<ResponseType<{ success: boolean }>> => {
    return this.fetcher.delete(
      `/api/chat-history/delete/${payload.sessionId}?userId=${payload.userId}`,
    );
  };
}
