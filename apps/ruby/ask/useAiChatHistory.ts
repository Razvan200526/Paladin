import { backend } from '@ruby/shared/backend';
import type { ChatHistoryItemType } from '@sdk/ChatHistoryFetcher';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type { ChatHistoryItemType as ChatHistoryItem };

interface UseAiChatHistoryOptions {
  userId: string | undefined;
  enabled?: boolean;
}

export const useAiChatHistory = (options: UseAiChatHistoryOptions) => {
  const { userId, enabled = true } = options;
  const queryClient = useQueryClient();

  // Fetch chat history
  const historyQuery = useQuery<ChatHistoryItemType[]>({
    queryKey: ['chat-history', userId],
    queryFn: async () => {
      if (!userId) return [];
      const response = await backend.chatHistory.getHistory(userId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch history');
      }
      return response.data || [];
    },
    enabled: !!userId && enabled,
    staleTime: 30000, // 30 seconds
  });

  // Create new session
  const createSessionMutation = useMutation({
    mutationFn: async (title?: string) => {
      if (!userId) throw new Error('User ID required');
      const response = await backend.chatHistory.createSession({
        userId,
        title,
      });
      if (!response.success) {
        throw new Error(response?.message || 'Failed to create session');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', userId] });
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      if (!userId) throw new Error('User ID required');
      const response = await backend.chatHistory.deleteSession({
        sessionId,
        userId,
      });
      if (!response.success) {
        throw new Error(response?.message || 'Failed to delete session');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', userId] });
    },
  });

  // Rename session
  const renameSessionMutation = useMutation({
    mutationFn: async ({
      sessionId,
      title,
    }: {
      sessionId: string;
      title: string;
    }) => {
      if (!userId) throw new Error('User ID required');
      const response = await backend.chatHistory.renameSession({
        sessionId,
        userId,
        title,
      });
      if (!response.success) {
        throw new Error(response?.message || 'Failed to rename session');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history', userId] });
    },
  });

  return {
    history: historyQuery.data || [],
    isLoading: historyQuery.isLoading,
    isError: historyQuery.isError,
    refetch: historyQuery.refetch,
    createSession: createSessionMutation.mutateAsync,
    deleteSession: deleteSessionMutation.mutateAsync,
    renameSession: renameSessionMutation.mutateAsync,
  };
};
