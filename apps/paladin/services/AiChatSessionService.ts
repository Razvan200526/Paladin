import { ChatMessageEntity } from '@paladin/entities/ChatMessageEntity';
import { ChatSessionEntity } from '@paladin/entities/ChatSessionEntity';
import { ChatMessageRepository } from '@paladin/repositories/ChatMessageRepository';
import { ChatSessionRepository } from '@paladin/repositories/ChatSessionRepository';
import { UserRepository } from '@paladin/repositories/UserRepository';
import { inject, logger, service } from '@razvan11/paladin';
import type { ChatContext } from './AiMessageService';
import { CacheService } from './CacheService';

const SESSION_CACHE_TTL = 60 * 60 * 24; // 24 hours
const USER_SESSIONS_CACHE_TTL = 60 * 5; // 5 minutes

export interface ChatSession {
  id: string;
  userId: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt?: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

@service()
export class AiChatSessionService {
  constructor(
    @inject(ChatSessionRepository) private sessionRepo: ChatSessionRepository,
    @inject(ChatMessageRepository) private messageRepo: ChatMessageRepository,
    @inject(UserRepository) private userRepo: UserRepository,
    @inject(CacheService) private cache: CacheService,
  ) {}

  /**
   * Get cache key for a session
   */
  private getSessionCacheKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  /**
   * Get cache key for user's session list
   */
  private getUserSessionsCacheKey(userId: string): string {
    return `user:${userId}:sessions`;
  }

  /**
   * Create a new chat session for a user (persists to DB)
   */
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    const user = await this.userRepo.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const sessionEntity = new ChatSessionEntity();
    sessionEntity.user = user;
    sessionEntity.resourceType = 'resume';
    sessionEntity.resourceId = 'ai-chat';
    sessionEntity.resourceName = title || 'New Chat';

    const savedEntity = await this.sessionRepo.create(sessionEntity);

    const session: ChatSession = {
      id: savedEntity.id,
      userId,
      title: savedEntity.resourceName,
      messages: [],
      createdAt: savedEntity.createdAt,
      updatedAt: savedEntity.updatedAt || undefined,
    };

    await this.cache.set(
      this.getSessionCacheKey(session.id),
      session,
      SESSION_CACHE_TTL,
    );

    await this.cache.delete(this.getUserSessionsCacheKey(userId));

    return session;
  }

  /**
   * Get a session by ID (loads from cache or DB)
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    const cached = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    if (cached) {
      cached.createdAt = new Date(cached.createdAt);
      if (cached.updatedAt) cached.updatedAt = new Date(cached.updatedAt);
      cached.messages = cached.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      }));
      return cached;
    }

    const entity = await this.sessionRepo.findOne(sessionId);
    if (!entity) return null;

    const messageEntities = await this.messageRepo.findBySessionId(sessionId);

    const session: ChatSession = {
      id: entity.id,
      userId: entity.user?.id || '',
      title: entity.resourceName,
      messages:
        messageEntities?.map((m) => ({
          id: m.id,
          content: m.content,
          sender: m.sender,
          timestamp: m.timestamp,
        })) || [],
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt || undefined,
    };

    await this.cache.set(
      this.getSessionCacheKey(session.id),
      session,
      SESSION_CACHE_TTL,
    );

    return session;
  }

  /**
   * Get all sessions for a user (for history sidebar)
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    logger.info(`[AiChatSessionService] Getting sessions for user: ${userId}`);

    const cached = await this.cache.get<ChatSession[]>(
      this.getUserSessionsCacheKey(userId),
    );
    if (cached) {
      logger.info(
        `[AiChatSessionService] Found cached sessions: ${cached.length}`,
      );
      return cached.map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: s.updatedAt ? new Date(s.updatedAt) : undefined,
        messages: s.messages.map((m) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    }

    const entities = await this.sessionRepo.findByUserId(userId);
    logger.info(`[AiChatSessionService] Found sessions: ${entities.length}`);

    const sessions = entities.map((e) => ({
      id: e.id,
      userId: e.user?.id || '',
      title: e.resourceName,
      messages:
        e.messages?.map((m) => ({
          id: m.id,
          content: m.content,
          sender: m.sender,
          timestamp: m.timestamp,
        })) || [],
      createdAt: e.createdAt,
      updatedAt: e.updatedAt || undefined,
    }));

    await this.cache.set(
      this.getUserSessionsCacheKey(userId),
      sessions,
      USER_SESSIONS_CACHE_TTL,
    );

    return sessions;
  }

  /**
   * Get or create a session for a user
   */
  async getOrCreateSession(
    userId: string,
    sessionId?: string,
  ): Promise<ChatSession> {
    if (sessionId) {
      const existing = await this.getSession(sessionId);
      if (existing && existing.userId === userId) {
        return existing;
      }
    }

    return this.createSession(userId);
  }

  /**
   * Add a message to a session (persists to DB)
   */
  async addMessage(
    sessionId: string,
    content: string,
    sender: 'user' | 'ai',
  ): Promise<ChatMessage> {
    const session = await this.getSession(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const sessionEntity = await this.sessionRepo.findOne(sessionId);
    if (!sessionEntity) {
      throw new Error(`Session entity ${sessionId} not found`);
    }

    const messageEntity = new ChatMessageEntity();
    messageEntity.chatSession = sessionEntity;
    messageEntity.content = content;
    messageEntity.sender = sender;

    const savedMessage = await this.messageRepo.create(messageEntity);

    const message: ChatMessage = {
      id: savedMessage.id,
      content: savedMessage.content,
      sender: savedMessage.sender,
      timestamp: savedMessage.timestamp,
    };

    session.messages.push(message);

    if (
      sender === 'user' &&
      session.messages.filter((m) => m.sender === 'user').length === 1
    ) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await this.updateSessionTitle(sessionId, title);
    }

    await this.cache.set(
      this.getSessionCacheKey(sessionId),
      session,
      SESSION_CACHE_TTL,
    );

    await this.cache.delete(this.getUserSessionsCacheKey(session.userId));

    return message;
  }

  /**
   * Update session title
   */
  async updateSessionTitle(sessionId: string, title: string): Promise<void> {
    const entity = await this.sessionRepo.findOne(sessionId);
    if (entity) {
      entity.resourceName = title;
      await this.sessionRepo.update(entity);
    }

    const session = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    if (session) {
      session.title = title;
      await this.cache.set(
        this.getSessionCacheKey(sessionId),
        session,
        SESSION_CACHE_TTL,
      );
      await this.cache.delete(this.getUserSessionsCacheKey(session.userId));
    }
  }

  /**
   * Update an AI message content (for streaming)
   */
  async updateAiMessage(
    sessionId: string,
    messageId: string,
    content: string,
  ): Promise<void> {
    const session = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    if (!session) return;

    const message = session.messages.find((m) => m.id === messageId);
    if (message && message.sender === 'ai') {
      message.content = content;
      await this.cache.set(
        this.getSessionCacheKey(sessionId),
        session,
        SESSION_CACHE_TTL,
      );
    }
  }


  async finalizeAiMessage(sessionId: string, messageId: string): Promise<void> {
    const session = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    if (!session) return;

    const message = session.messages.find((m) => m.id === messageId);
    if (!message || message.sender !== 'ai') return;

    const messageEntity = await this.messageRepo.findOne(messageId);
    if (messageEntity) {
      messageEntity.content = message.content;
      await this.messageRepo.update(messageEntity);
    }
  }


  async getContext(sessionId: string, maxMessages = 10): Promise<ChatContext[]> {
    const session = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    if (!session) return [];

    const recentMessages = session.messages.slice(-maxMessages);
    return recentMessages.map((msg) => ({
      role: msg.sender === 'user' ? ('user' as const) : ('model' as const),
      content: msg.content,
    }));
  }

  /**
   * Get all messages in a session
   */
  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    const session = await this.cache.get<ChatSession>(
      this.getSessionCacheKey(sessionId),
    );
    return session?.messages || [];
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    logger.info(`[AiChatSessionService] Deleting session: ${sessionId}`);

    const session = await this.getSession(sessionId);

    try {
      const deleteMessagesResult =
        await this.messageRepo.deleteBySessionId(sessionId);
      logger.info(
        `[AiChatSessionService] Deleted messages: ${deleteMessagesResult}`,
      );

      const deleteSessionResult = await this.sessionRepo.delete({
        id: sessionId,
      });
      logger.info(
        `[AiChatSessionService] Deleted session: ${deleteSessionResult}`,
      );

      await this.cache.delete(this.getSessionCacheKey(sessionId));

      if (session) {
        await this.cache.delete(this.getUserSessionsCacheKey(session.userId));
      }

      logger.info(
        `[AiChatSessionService] Cleared cache for session: ${sessionId}`,
      );
    } catch (error) {
      logger.error(new Error(`[AiChatSessionService] Delete error: ${error}`));
      throw error;
    }
  }

  /**
   * Clear cache for a session
   */
  async clearSessionCache(sessionId: string): Promise<void> {
    await this.cache.delete(this.getSessionCacheKey(sessionId));
  }
}
