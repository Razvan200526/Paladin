import { Toast } from '@common/components/toast';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { queryClient } from '@ruby/shared/QueryClient';
import type { ResumeBuilderData } from '@sdk/ResumeBuilderFetcher';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export interface UseResumeBuilderOptions {
  resumeId?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export const useResumeBuilder = (options: UseResumeBuilderOptions = {}) => {
  const { resumeId } = options;
  const { data: user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const resumeBuildersQuery = useQuery({
    queryKey: ['resume-builders', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const response = await backend.resumeBuilder.getByUser(user.id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch resume builders');
      }
      return response.data || [];
    },
    enabled: !!user?.id,
  });

  const resumeBuilderQuery = useQuery({
    queryKey: ['resume-builder', resumeId],
    queryFn: async () => {
      if (!resumeId) return null;
      const response = await backend.resumeBuilder.getOne(resumeId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch resume builder');
      }
      return response.data || null;
    },
    enabled: !!resumeId,
  });

  const createMutation = useMutation({
    mutationFn: async (params: {
      name: string;
      templateId?: string;
      data: ResumeBuilderData;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeBuilder.create({
        userId: user.id,
        ...params,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to create resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-builders'] });
      Toast.success({ description: 'Resume created successfully' });
      setLastSaved(new Date());
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to create resume',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (params: {
      id: string;
      name?: string;
      templateId?: string;
      data?: ResumeBuilderData;
      status?: 'draft' | 'published';
    }) => {
      if (!user?.id) throw new Error('User not authenticated');
      const { id, ...updateData } = params;
      const response = await backend.resumeBuilder.update(id, {
        userId: user.id,
        ...updateData,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to update resume');
      }
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['resume-builders'] });
      if (data?.id) {
        queryClient.invalidateQueries({
          queryKey: ['resume-builder', data.id],
        });
      }
      setLastSaved(new Date());
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to save resume',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeBuilder.delete(id, user.id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-builders'] });
      Toast.success({ description: 'Resume deleted successfully' });
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to delete resume',
      });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeBuilder.duplicate(id, user.id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to duplicate resume');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume-builders'] });
      Toast.success({ description: 'Resume duplicated successfully' });
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to duplicate resume',
      });
    },
  });

  const createResume = useCallback(
    async (name: string, data: ResumeBuilderData, templateId?: string) => {
      setIsSaving(true);
      try {
        const result = await createMutation.mutateAsync({
          name,
          data,
          templateId,
        });
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [createMutation],
  );

  const saveResume = useCallback(
    async (
      id: string,
      updates: {
        name?: string;
        templateId?: string;
        data?: ResumeBuilderData;
        status?: 'draft' | 'published';
      },
    ) => {
      setIsSaving(true);
      try {
        const result = await updateMutation.mutateAsync({ id, ...updates });
        return result;
      } finally {
        setIsSaving(false);
      }
    },
    [updateMutation],
  );

  const deleteResume = useCallback(
    async (id: string) => {
      return deleteMutation.mutateAsync(id);
    },
    [deleteMutation],
  );

  const duplicateResume = useCallback(
    async (id: string) => {
      return duplicateMutation.mutateAsync(id);
    },
    [duplicateMutation],
  );

  const downloadPDF = useCallback(
    async (
      id: string,
      options?: {
        includeLinks?: boolean;
        fontSize?: 'small' | 'medium' | 'large';
      },
    ) => {
      if (!user?.id) {
        Toast.error({ description: 'User not authenticated' });
        return;
      }

      try {
        await backend.resumeBuilder.downloadPDF(id, user.id, options);
      } catch (error) {
        Toast.error({
          description:
            error instanceof Error ? error.message : 'Failed to download PDF',
        });
      }
    },
    [user?.id],
  );
  const downloadPDFFromData = useCallback(
    async (
      data: ResumeBuilderData,
      templateId?: string,
      name?: string,
      options?: {
        includeLinks?: boolean;
        fontSize?: 'small' | 'medium' | 'large';
      },
    ) => {
      if (!user?.id) {
        Toast.error({ description: 'User not authenticated' });
        return;
      }

      try {
        await backend.resumeBuilder.downloadPDFFromData({
          userId: user.id,
          data,
          templateId,
          name,
          options,
        });
      } catch (error) {
        Toast.error({
          description:
            error instanceof Error ? error.message : 'Failed to download PDF',
        });
      }
    },
    [user?.id],
  );

  return {
    resumeBuilders: resumeBuildersQuery.data || [],
    resumeBuilder: resumeBuilderQuery.data,
    isLoading: resumeBuildersQuery.isLoading || resumeBuilderQuery.isLoading,
    isError: resumeBuildersQuery.isError || resumeBuilderQuery.isError,

    isSaving,
    lastSaved,

    createResume,
    saveResume,
    deleteResume,
    duplicateResume,
    downloadPDF,
    downloadPDFFromData,

    refetchResumeBuilders: resumeBuildersQuery.refetch,
    refetchResumeBuilder: resumeBuilderQuery.refetch,

    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      duplicate: duplicateMutation,
    },
  };
};
