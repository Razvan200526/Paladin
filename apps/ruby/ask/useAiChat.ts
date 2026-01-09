import { useCallback, useEffect, useRef, useState } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  isStreaming?: boolean;
}

interface UseAiChatOptions {
  userId: string | undefined;
  enabled?: boolean;
  onError?: (error: string) => void;
  onSessionChange?: (sessionId: string, title: string) => void;
}

interface UseAiChatReturn {
  messages: ChatMessage[];
  sessionId: string | null;
  sessionTitle: string | null;
  isConnected: boolean;
  isStreaming: boolean;
  sendMessage: (message: string) => void;
  clearChat: () => void;
  switchSession: (sessionId: string) => void;
  newChat: () => void;
}

interface WSMessage {
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

export const useAiChat = (options: UseAiChatOptions): UseAiChatReturn => {
  const { userId, enabled = true, onError, onSessionChange } = options;

  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionTitle, setSessionTitle] = useState<string | null>(null);
  const currentMessageRef = useRef<string>('');
  const currentMessageIdRef = useRef<string | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isMountedRef = useRef(true);
  const isConnectingRef = useRef(false);
  const userIdRef = useRef(userId);
  const onErrorRef = useRef(onError);
  const onSessionChangeRef = useRef(onSessionChange);
  const pendingSessionSwitchRef = useRef<string | null>(null);

  useEffect(() => {
    userIdRef.current = userId;
    onErrorRef.current = onError;
    onSessionChangeRef.current = onSessionChange;
  }, [userId, onError, onSessionChange]);

  const connect = useCallback(() => {
    if (!userIdRef.current || !enabled) return;

    if (isConnectingRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    if (wsRef.current?.readyState === WebSocket.CONNECTING) return;

    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.warn('[AI Chat] Max reconnect attempts reached');
      return;
    }

    isConnectingRef.current = true;
    const wsUrl = 'ws://localhost:3000/ws/ai-chat';

    try {
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.onerror = null;
        wsRef.current.onmessage = null;
        wsRef.current.onopen = null;
        wsRef.current.close();
        wsRef.current = null;
      }

      console.debug('[AI Chat] Connecting to', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          isConnectingRef.current = false;
          return;
        }

        console.debug('[AI Chat] Connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;

        const initSessionId = pendingSessionSwitchRef.current;
        pendingSessionSwitchRef.current = null;

        ws.send(
          JSON.stringify({
            action: 'chat:init',
            userId: userIdRef.current,
            sessionId: initSessionId,
          }),
        );
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;

        try {
          const data: WSMessage = JSON.parse(event.data);

          switch (data.type) {
            case 'chat:session':
              setSessionId(data.sessionId || null);
              setSessionTitle(data.title || 'New Chat');
              if (data.messages && data.messages.length > 0) {
                setMessages(
                  data.messages.map((msg) => ({
                    id: msg.id,
                    content: msg.content,
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                  })),
                );
              } else {
                setMessages([]);
              }
              if (data.sessionId) {
                onSessionChangeRef.current?.(
                  data.sessionId,
                  data.title || 'New Chat',
                );
              }
              break;

            case 'chat:token':
              currentMessageRef.current += data.content || '';
              currentMessageIdRef.current = data.messageId || null;

              setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.isStreaming) {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMsg,
                      content: currentMessageRef.current,
                    },
                  ];
                }
                return prev;
              });
              break;

            case 'chat:complete':
              setIsStreaming(false);
              setMessages((prev) => {
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.isStreaming) {
                  return [
                    ...prev.slice(0, -1),
                    {
                      ...lastMsg,
                      content: data.content || currentMessageRef.current,
                      isStreaming: false,
                    },
                  ];
                }
                return prev;
              });
              currentMessageRef.current = '';
              currentMessageIdRef.current = null;
              break;

            case 'chat:error':
              setIsStreaming(false);
              onErrorRef.current?.(data.content || 'Unknown error');
              setMessages((prev) => prev.filter((m) => !m.isStreaming));
              break;
          }
        } catch (error) {
          console.error('[AI Chat] Error parsing message:', error);
        }
      };

      ws.onclose = () => {
        console.debug('[AI Chat] Disconnected');
        setIsConnected(false);
        wsRef.current = null;
        isConnectingRef.current = false;

        if (
          isMountedRef.current &&
          enabled &&
          reconnectAttempts.current < maxReconnectAttempts
        ) {
          const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
          reconnectAttempts.current++;
          setTimeout(() => {
            if (isMountedRef.current && enabled) {
              connect();
            }
          }, delay);
        }
      };

      ws.onerror = () => {
        console.error('[AI Chat] WebSocket error');
        isConnectingRef.current = false;
      };
    } catch (error) {
      console.error('[AI Chat] Connection error:', error);
      isConnectingRef.current = false;
    }
  }, [enabled]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.onmessage = null;
      wsRef.current.onopen = null;
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    isConnectingRef.current = false;
    reconnectAttempts.current = 0;
  }, []);

  const sendMessage = useCallback(
    (message: string) => {
      if (
        !message.trim() ||
        !wsRef.current ||
        wsRef.current.readyState !== WebSocket.OPEN
      ) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user_${Date.now()}`,
        content: message.trim(),
        role: 'user',
      };

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        content: '',
        role: 'assistant',
        isStreaming: true,
      };

      setMessages((prev) => [...prev, userMessage, aiMessage]);
      setIsStreaming(true);
      currentMessageRef.current = '';

      wsRef.current.send(
        JSON.stringify({
          action: 'chat:message',
          userId: userIdRef.current,
          sessionId,
          message: message.trim(),
        }),
      );
    },
    [sessionId],
  );

  const clearChat = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: 'chat:clear',
          userId: userIdRef.current,
          sessionId,
        }),
      );
    }
    setMessages([]);
  }, [sessionId]);

  const switchSession = useCallback(
    (newSessionId: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            action: 'chat:switch',
            sessionId: newSessionId,
          }),
        );
      } else {
        pendingSessionSwitchRef.current = newSessionId;
        connect();
      }
    },
    [connect],
  );

  const newChat = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          action: 'chat:clear',
          userId: userIdRef.current,
          sessionId,
        }),
      );
    }
  }, [sessionId]);

  useEffect(() => {
    isMountedRef.current = true;

    if (userId && enabled) {
      const timeout = setTimeout(() => {
        if (isMountedRef.current) {
          connect();
        }
      }, 100);

      return () => {
        isMountedRef.current = false;
        clearTimeout(timeout);
        disconnect();
      };
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [userId, enabled, connect, disconnect]);

  return {
    messages,
    sessionId,
    sessionTitle,
    isConnected,
    isStreaming,
    sendMessage,
    clearChat,
    switchSession,
    newChat,
  };
};
