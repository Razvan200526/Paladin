import { backend } from '@ruby/shared/backend';
import { queryClient } from '@ruby/shared/QueryClient';
import type { CoverLetterType, ResponseType, ResumeType } from '@sdk/types';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

export const useResumes = (userId: string) => {
  return useQuery({
    queryKey: ['resumes', userId],
    queryFn: async () => {
      const response = await backend.resume.resumes.retrieve({ userId });

      return response.data as ResumeType[];
    },
  });
};

export const useDeleteResume = (userId: string) => {
  const { id: resumeId } = useParams<{ id: string }>();
  return useMutation({
    mutationFn: async () => {
      return backend.resume.resumes.delete({
        resumeIds: [resumeId || ''],
        userId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['resumes', userId],
      });
    },
  });
};

export const useRenameCoverLetter = (userId: string) => {
  const { id: coverLetterId } = useParams<{ id: string }>();
  return useMutation({
    mutationFn: async (newName: string) => {
      return backend.coverLetter.coverletter.rename({
        coverletterId: coverLetterId || '',
        newName: newName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coverletter', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['coverletter', coverLetterId],
      });
    },
  });
};

export const useCreateResume = (userId: string) => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return backend.upload.resume.uploadResume(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['resumes', userId],
      });
    },
  });
};

export const useRenameResume = (userId: string) => {
  const { id: resumeId } = useParams<{ id: string }>();
  return useMutation({
    mutationFn: async (newName: string) => {
      return backend.resume.resumes.rename({
        id: resumeId || '',
        newName: newName,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['resumes', userId],
      });
      queryClient.invalidateQueries({
        queryKey: ['resume', resumeId],
      });
    },
  });
};
export const useCoverLetters = (userId: string) => {
  return useQuery({
    queryKey: ['coverletters', userId],
    queryFn: async () => {
      const response = await backend.coverLetter.coverletter.retrieve({
        userId,
      });
      return response.data as CoverLetterType[];
    },
  });
};
export const useGetCoverLetter = (userId: string) => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['coverletter', userId],
    queryFn: async () => {
      const response = await backend.coverLetter.coverletter.get({
        id: id || '',
      });
      return response.data as CoverLetterType;
    },
    enabled: !!id && !!userId,
  });
};

export const useCoverLetterSuggestions = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['coverletterSuggestions', id],
    queryFn: async () => {
      const response = await backend.coverLetter.coverletter.getSuggestions({
        id: id || '',
      });
      return response;
    },
    enabled: false,
    staleTime: 5 * 6 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
export const useAddCoverLetter = (userId: string) => {
  return useMutation({
    mutationFn: async (data: FormData) => {
      return backend.upload.coverLetter.upload(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['coverletters', userId],
      });
    },
  });
};

export const useDeleteResumes = (userId: string) => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      // Convert string IDs to numbers for the backend
      return backend.resume.resumes.delete({
        resumeIds: ids,
        userId: userId,
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        // Invalidate the resumes query to refresh the list
        queryClient.invalidateQueries({
          queryKey: ['resumes', userId],
        });
      }
    },
  });
};

export const useDeleteCoverLetters = (userId: string) => {
  return useMutation({
    mutationFn: async (ids: string[]) => {
      return backend.coverLetter.coverletter.delete({
        coverletterIds: ids,
        userId: userId,
      });
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ['coverletters', userId],
        });
      }
    },
  });
};

export const useGetResume = (userId: string) => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const response = await backend.resume.resumes.get({
        id: id || '',
      });
      return response.data as ResumeType;
    },
    enabled: !!id && !!userId,
  });
};

export const useResumeSuggestions = () => {
  const { id } = useParams<{ id: string }>();
  return useQuery({
    queryKey: ['resumeSuggestions', id],
    queryFn: async () => {
      const response = await backend.resume.resumes.getSuggestions({
        id: id || '',
      });
      return response;
    },
    enabled: false,
    staleTime: 5 * 6 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export const useSendMessage = (type: 'resume' | 'coverletter') => {
  const { id } = useParams<{ id: string }>();
  return useMutation({
    mutationFn: async (message: string) => {
      const res = await backend.message[type].message({
        question: message,
        id: id || '',
      });
      return res as ResponseType<{
        ai_response: { text: string };
      }>;
    },
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({
          queryKey: ['resumes'],
        });
      }
    },
  });
};
