import { Toast } from '@common/components/toast';
import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import { useMutation } from '@tanstack/react-query';

export const useUpdateProfile = (userId: string) => {
  return useMutation({
    mutationFn: async (payload: any) => {
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
