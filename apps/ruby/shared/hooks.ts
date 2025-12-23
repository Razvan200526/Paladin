import { useQuery } from '@tanstack/react-query';
import { backend } from './backend';

export const useAuth = () => {
  return useQuery({
    queryKey: ['auth', 'retrieve'],
    queryFn: async () => {
      const response = await backend.auth.retrieve();

      return response.data.user;
    },
    staleTime: 60_000,
    retry: false,
  });
};
