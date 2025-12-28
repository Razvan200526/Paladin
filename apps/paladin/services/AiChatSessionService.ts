import { ChatMessageEntity } from '@paladin/entities/ChatMessageEntity';
import { ChatSessionEntity } from '@paladin/entities/ChatSessionEntity';
import { ChatMessageRepository } from '@paladin/repositories/ChatMessageRepository';
import { ChatSessionRepository } from '@paladin/repositories/ChatSessionRepository';
import { UserRepository } from '@paladin/repositories/UserRepository';
import { inject, logger, service } from '@razvan11/paladin';
import type { ChatContext } from './AiMessageService';

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
  // In-memory cache for active sessions
  private activeSessions: Map<string, ChatSession> = new Map();

  constructor(
    @inject(ChatSessionRepository) private sessionRepo: ChatSessionRepository,
    @inject(ChatMessageRepository) private messageRepo: ChatMessageRepository,
    @inject(UserRepository) private userRepo: UserRepository,
  ) {}

  /**
   * Create a new chat session for a user (persists to DB)
   */
  async createSession(userId: string, title?: string): Promise<ChatSession> {
    const user = await this.userRepo.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create entity
    const sessionEntity = new ChatSessionEntity();
    sessionEntity.user = user;
    sessionEntity.resourceType = 'resume'; // Default type for AI chat
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

    this.activeSessions.set(session.id, session);
    return session;
  }

  /**
   * Get a session by ID (loads from DB if not in cache)
   */
  async getSession(sessionId: string): Promise<ChatSession | null> {
    // Check cache first
    if (this.activeSessions.has(sessionId)) {
      return this.activeSessions.get(sessionId) ?? null;
    }

    // Load from DB
    const entity = await this.sessionRepo.findOne(sessionId);
    if (!entity) return null;

    // Load messages
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

    this.activeSessions.set(session.id, session);
    return session;
  }

  /**
   * Get all sessions for a user (for history sidebar)
   */
  async getUserSessions(userId: string): Promise<ChatSession[]> {
    logger.info(`[AiChatSessionService] Getting sessions for user: ${userId}`);
    const entities = await this.sessionRepo.findByUserId(userId);
    logger.info(`[AiChatSessionService] Found sessions: ${entities.length}`);

    return entities.map((e) => ({
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

    // Create new session
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

    // Get session entity for relation
    const sessionEntity = await this.sessionRepo.findOne(sessionId);
    if (!sessionEntity) {
      throw new Error(`Session entity ${sessionId} not found`);
    }

    // Create message entity
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

    // Update cache
    session.messages.push(message);

    // Update session title from first user message
    if (
      sender === 'user' &&
      session.messages.filter((m) => m.sender === 'user').length === 1
    ) {
      const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
      await this.updateSessionTitle(sessionId, title);
    }

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

    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.title = title;
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
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const message = session.messages.find((m) => m.id === messageId);
    if (message && message.sender === 'ai') {
      message.content = content;
    }
  }

  /**
   * Finalize AI message (persist to DB after streaming completes)
   */
  async finalizeAiMessage(sessionId: string, messageId: string): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const message = session.messages.find((m) => m.id === messageId);
    if (!message || message.sender !== 'ai') return;

    // Update in DB
    const messageEntity = await this.messageRepo.findOne(messageId);
    if (messageEntity) {
      messageEntity.content = message.content;
      await this.messageRepo.update(messageEntity);
    }
  }

  /**
   * Get conversation context for Gemini (last N messages)
   */
  getContext(sessionId: string, maxMessages = 10): ChatContext[] {
    const session = this.activeSessions.get(sessionId);
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
  getMessages(sessionId: string): ChatMessage[] {
    return this.activeSessions.get(sessionId)?.messages || [];
  }

  /**
   * Delete a session
   */
  async deleteSession(sessionId: string): Promise<void> {
    logger.info(`[AiChatSessionService] Deleting session: ${sessionId}`);
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

      this.activeSessions.delete(sessionId);
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
  clearSessionCache(sessionId: string): void {
    this.activeSessions.delete(sessionId);
  }
}
