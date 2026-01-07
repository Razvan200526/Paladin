import { Toast } from '@common/components/toast';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

export interface GenerateSummaryParams {
  jobTitle: string;
  yearsOfExperience: number;
  skills?: string[];
  industry?: string;
}

export interface GenerateExperienceParams {
  position: string;
  company: string;
  responsibilities?: string;
  achievements?: string;
}

export interface SuggestSkillsParams {
  jobTitle: string;
  industry?: string;
  existingSkills?: string[];
}

export interface ImproveContentParams {
  content: string;
  type: 'summary' | 'experience' | 'education' | 'project';
}

export interface GenerateProjectParams {
  projectName: string;
  technologies: string[];
  role?: string;
  outcomes?: string;
}

export const useResumeAI = () => {
  const { data: user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  // Generate professional summary
  const generateSummaryMutation = useMutation({
    mutationFn: async (params: GenerateSummaryParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeAI.generateSummary({
        ...params,
        userId: user.id,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to generate summary');
      }
      return response.data;
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to generate summary',
      });
    },
  });

  const generateExperienceMutation = useMutation({
    mutationFn: async (params: GenerateExperienceParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeAI.generateExperienceBullets({
        ...params,
        userId: user.id,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to generate bullet points');
      }
      return response.data;
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to generate experience content',
      });
    },
  });

  const suggestSkillsMutation = useMutation({
    mutationFn: async (params: SuggestSkillsParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeAI.suggestSkills({
        ...params,
        userId: user.id,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to suggest skills');
      }
      return response.data;
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to suggest skills',
      });
    },
  });

  const improveContentMutation = useMutation({
    mutationFn: async (params: ImproveContentParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeAI.improveContent({
        ...params,
        userId: user.id,
      });
      if (!response.success) {
        throw new Error(response.message || 'Failed to improve content');
      }
      return response.data;
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to improve content',
      });
    },
  });

  // Generate project description
  const generateProjectMutation = useMutation({
    mutationFn: async (params: GenerateProjectParams) => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await backend.resumeAI.generateProjectDescription({
        ...params,
        userId: user.id,
      });
      if (!response.success) {
        throw new Error(
          response.message || 'Failed to generate project description',
        );
      }
      return response.data;
    },
    onError: (error: Error) => {
      Toast.error({
        description: error.message || 'Failed to generate project description',
      });
    },
  });

  // Convenience methods
  const generateSummary = useCallback(
    async (params: GenerateSummaryParams) => {
      setIsGenerating(true);
      try {
        const result = await generateSummaryMutation.mutateAsync(params);
        return result?.content || '';
      } finally {
        setIsGenerating(false);
      }
    },
    [generateSummaryMutation],
  );

  const generateExperienceBullets = useCallback(
    async (params: GenerateExperienceParams) => {
      setIsGenerating(true);
      try {
        const result = await generateExperienceMutation.mutateAsync(params);
        return result?.bullets || [];
      } finally {
        setIsGenerating(false);
      }
    },
    [generateExperienceMutation],
  );

  const suggestSkills = useCallback(
    async (params: SuggestSkillsParams) => {
      setIsGenerating(true);
      try {
        const result = await suggestSkillsMutation.mutateAsync(params);
        return result?.categories || [];
      } finally {
        setIsGenerating(false);
      }
    },
    [suggestSkillsMutation],
  );

  const improveContent = useCallback(
    async (params: ImproveContentParams) => {
      setIsGenerating(true);
      try {
        const result = await improveContentMutation.mutateAsync(params);
        return {
          improved: result?.improved || '',
          changes: result?.changes || [],
        };
      } finally {
        setIsGenerating(false);
      }
    },
    [improveContentMutation],
  );

  const generateProjectDescription = useCallback(
    async (params: GenerateProjectParams) => {
      setIsGenerating(true);
      try {
        const result = await generateProjectMutation.mutateAsync(params);
        return result?.content || '';
      } finally {
        setIsGenerating(false);
      }
    },
    [generateProjectMutation],
  );

  return {
    // State
    isGenerating,
    isGeneratingSummary: generateSummaryMutation.isPending,
    isGeneratingExperience: generateExperienceMutation.isPending,
    isSuggestingSkills: suggestSkillsMutation.isPending,
    isImprovingContent: improveContentMutation.isPending,
    isGeneratingProject: generateProjectMutation.isPending,

    // Methods
    generateSummary,
    generateExperienceBullets,
    suggestSkills,
    improveContent,
    generateProjectDescription,

    // Raw mutations (for more control)
    mutations: {
      summary: generateSummaryMutation,
      experience: generateExperienceMutation,
      skills: suggestSkillsMutation,
      improve: improveContentMutation,
      project: generateProjectMutation,
    },
  };
};
