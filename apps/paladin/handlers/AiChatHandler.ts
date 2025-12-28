import { AiChatSessionService } from '@paladin/services/AiChatSessionService';
import { AiQueryService } from '@paladin/services/AiMessageService';
import {
  inject,
  onClose,
  onMessage,
  onOpen,
  websocket,
} from '@razvan11/paladin';
import type { ServerWebSocket } from 'bun';

interface WSData {
  path: string;
  userId?: string;
  sessionId?: string;
}

interface ChatAction {
  action: 'chat:message' | 'chat:init' | 'chat:clear' | 'chat:switch';
  userId?: string;
  sessionId?: string;
  message?: string;
}

interface ChatResponse {
  type:
    | 'chat:token'
    | 'chat:complete'
    | 'chat:error'
    | 'chat:session'
    | 'chat:history';
  sessionId?: string;
  messageId?: string;
  content?: string;
  title?: string;
  messages?: Array<{
    id: string;
    content: string;
    sender: 'user' | 'ai';
    timestamp: Date;
  }>;
}

@websocket('/ws/ai-chat')
export class AiChatHandler {
  constructor(
    @inject(AiQueryService) private aiService: AiQueryService,
    @inject(AiChatSessionService) private sessionService: AiChatSessionService,
  ) {}

  @onOpen()
  handleOpen(ws: ServerWebSocket<WSData>) {
    console.log('[AI Chat] Client connected');
  }

  @onMessage()
  async handleMessage(ws: ServerWebSocket<WSData>, message: string | Buffer) {
    const messageStr =
      typeof message === 'string' ? message : message.toString();

    try {
      const data: ChatAction = JSON.parse(messageStr);

      switch (data.action) {
        case 'chat:init':
          await this.handleInit(ws, data);
          break;

        case 'chat:message':
          await this.handleChatMessage(ws, data);
          break;

        case 'chat:clear':
          await this.handleClear(ws, data);
          break;

        case 'chat:switch':
          await this.handleSwitch(ws, data);
          break;

        default:
          console.log('[AI Chat] Unknown action:', data.action);
      }
    } catch (error) {
      console.error('[AI Chat] Error:', error);
      this.sendError(
        ws,
        error instanceof Error ? error.message : 'Unknown error',
      );
    }
  }

  @onClose()
  handleClose(ws: ServerWebSocket<WSData>) {
    console.log('[AI Chat] Client disconnected');
  }

  private async handleInit(ws: ServerWebSocket<WSData>, data: ChatAction) {
    if (!data.userId) {
      this.sendError(ws, 'userId is required');
      return;
    }

    // Store userId in ws data
    (ws.data as WSData).userId = data.userId;

    // If sessionId provided, load that session
    if (data.sessionId) {
      const session = await this.sessionService.getSession(data.sessionId);
      if (session && session.userId === data.userId) {
        (ws.data as WSData).sessionId = session.id;

        const response: ChatResponse = {
          type: 'chat:session',
          sessionId: session.id,
          title: session.title,
          messages: session.messages,
        };
        ws.send(JSON.stringify(response));
        return;
      }
    }

    // No session provided or invalid - send empty state (no session created)
    const response: ChatResponse = {
      type: 'chat:session',
      sessionId: undefined,
      title: 'New Chat',
      messages: [],
    };
    ws.send(JSON.stringify(response));
  }

  private async handleChatMessage(
    ws: ServerWebSocket<WSData>,
    data: ChatAction,
  ) {
    const userId = (ws.data as WSData).userId || data.userId;
    const sessionId = (ws.data as WSData).sessionId || data.sessionId;

    if (!userId || !data.message) {
      this.sendError(ws, 'userId and message are required');
      return;
    }

    // Get or create session if not initialized
    const session = sessionId
      ? await this.sessionService.getOrCreateSession(userId, sessionId)
      : await this.sessionService.createSession(userId);

    (ws.data as WSData).sessionId = session.id;

    // Add user message to DB
    await this.sessionService.addMessage(session.id, data.message, 'user');

    // Create placeholder AI message in DB
    const aiMessage = await this.sessionService.addMessage(
      session.id,
      '',
      'ai',
    );

    // Get context for multi-turn conversation (exclude empty AI message)
    const context = this.sessionService.getContext(session.id);

    // Stream response
    let fullContent = '';
    try {
      await this.aiService.streamResponse(
        data.message,
        context.slice(0, -1), // Exclude empty AI message from context
        (chunk) => {
          if (chunk.type === 'token') {
            fullContent += chunk.content;

            // Update cached message
            this.sessionService.updateAiMessage(
              session.id,
              aiMessage.id,
              fullContent,
            );

            // Send token to client
            const response: ChatResponse = {
              type: 'chat:token',
              sessionId: session.id,
              messageId: aiMessage.id,
              content: chunk.content,
            };
            ws.send(JSON.stringify(response));
          } else if (chunk.type === 'complete') {
            // Finalize message in DB
            this.sessionService.finalizeAiMessage(session.id, aiMessage.id);

            // Send completion
            const response: ChatResponse = {
              type: 'chat:complete',
              sessionId: session.id,
              messageId: aiMessage.id,
              content: fullContent,
            };
            ws.send(JSON.stringify(response));
          } else if (chunk.type === 'error') {
            this.sendError(ws, chunk.content);
          }
        },
      );
    } catch (error) {
      this.sendError(ws, error instanceof Error ? error.message : 'AI error');
    }
  }

  private async handleClear(ws: ServerWebSocket<WSData>, data: ChatAction) {
    const sessionId = (ws.data as WSData).sessionId || data.sessionId;
    if (sessionId) {
      await this.sessionService.deleteSession(sessionId);
    }

    // Clear session from ws data - don't create a new one
    (ws.data as WSData).sessionId = undefined;

    // Send empty state (no new session created)
    const response: ChatResponse = {
      type: 'chat:session',
      sessionId: undefined,
      title: 'New Chat',
      messages: [],
    };
    ws.send(JSON.stringify(response));
  }

  private async handleSwitch(ws: ServerWebSocket<WSData>, data: ChatAction) {
    if (!data.sessionId) {
      this.sendError(ws, 'sessionId is required');
      return;
    }

    const session = await this.sessionService.getSession(data.sessionId);
    if (!session) {
      this.sendError(ws, 'Session not found');
      return;
    }

    // Update ws data
    (ws.data as WSData).sessionId = session.id;

    // Send session info
    const response: ChatResponse = {
      type: 'chat:session',
      sessionId: session.id,
      title: session.title,
      messages: session.messages,
    };
    ws.send(JSON.stringify(response));
  }

  private sendError(ws: ServerWebSocket<WSData>, message: string) {
    const response: ChatResponse = {
      type: 'chat:error',
      content: message,
    };
    ws.send(JSON.stringify(response));
  }
}
