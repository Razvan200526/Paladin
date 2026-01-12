import { Toast } from '@common/components/toast';
import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import { useMutation, useQuery } from '@tanstack/react-query';

export const useUpdateProfile = (userId: string) => {
  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      firstName?: string;
      lastName?: string;
      profession?: string;
      image?: string;
      bio?: string;
    }) => {
      const res = await backend.users.update(userId, payload);
      if (!res.success) {
        console.error('Profile update failed:', res.message);
        Toast.error({ description: 'Failed to update profile' });
      }
      queryClient.invalidateQueries({ queryKey: ['auth', 'retrieve'] });
      return res;
    },
  });
};
export interface SessionType {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

export const useSessions = (userId: string) => {
  return useQuery({
    queryKey: ['user', 'sessions', userId],
    queryFn: async () => {
      const response = await backend.users.sessions.filter({
        userId,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });
      if (response.success) {
        return response.data.sessions as SessionType[];
      }
      return [];
    },
    enabled: !!userId,
    staleTime: 30_000,
  });
};

export const useRevokeSession = () => {
  return useMutation({
    mutationFn: async (sessionId: string) => {
      const res = await backend.users.sessions.delete(sessionId);
      if (!res.success) {
        Toast.error({ description: 'Failed to revoke session' });
      } else {
        Toast.success({ description: 'Session revoked successfully' });
      }
      queryClient.invalidateQueries({ queryKey: ['user', 'sessions'] });
      return res;
    },
  });
};

// ============================================================================
// Account Hooks
// ============================================================================

export const useDeleteAccount = () => {
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await backend.users.delete(userId);
      if (!res.success) {
        Toast.error({
          description: res.message || 'Failed to delete account',
        });
      } else {
        Toast.success({ description: 'Account deleted successfully' });
        await backend.auth.signout();
      }
      return res;
    },
  });
};
