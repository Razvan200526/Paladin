import type { Fetcher } from './Fetcher';

export interface AICompletionRequest {
  type:
    | 'summary'
    | 'experience'
    | 'education'
    | 'skills'
    | 'project'
    | 'improve';
  context: {
    jobTitle?: string;
    company?: string;
    industry?: string;
    yearsOfExperience?: number;
    existingContent?: string;
    skills?: string[];
    projectName?: string;
    technologies?: string[];
  };
  userId: string;
}

export interface AICompletionResponse {
  success: boolean;
  data?: {
    content: string;
    suggestions?: string[];
  };
  message?: string;
}

export interface AISkillsSuggestionRequest {
  jobTitle: string;
  industry?: string;
  existingSkills?: string[];
  userId: string;
}

export interface AISkillsSuggestionResponse {
  success: boolean;
  data?: {
    categories: Array<{
      name: string;
      skills: string[];
    }>;
  };
  message?: string;
}

export interface AIBulletPointRequest {
  position: string;
  company: string;
  responsibilities?: string;
  achievements?: string;
  userId: string;
}

export interface AIBulletPointResponse {
  success: boolean;
  data?: {
    bullets: string[];
  };
  message?: string;
}

export interface AIImproveRequest {
  content: string;
  type: 'summary' | 'experience' | 'education' | 'project';
  userId: string;
}

export interface AIImproveResponse {
  success: boolean;
  data?: {
    improved: string;
    changes: string[];
  };
  message?: string;
}

export class ResumeAIFetcher {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  /**
   * Generate AI completion for various resume sections
   */
  async generateCompletion(
    request: AICompletionRequest,
  ): Promise<AICompletionResponse> {
    return this.fetcher.post<AICompletionResponse>(
      '/api/resume-ai/completion',
      request,
    );
  }

  /**
   * Generate a professional summary based on job title and experience
   */
  async generateSummary(params: {
    jobTitle: string;
    yearsOfExperience: number;
    skills?: string[];
    industry?: string;
    userId: string;
  }): Promise<AICompletionResponse> {
    return this.fetcher.post<AICompletionResponse>(
      '/api/resume-ai/generate-summary',
      params,
    );
  }

  /**
   * Generate bullet points for experience section
   */
  async generateExperienceBullets(
    request: AIBulletPointRequest,
  ): Promise<AIBulletPointResponse> {
    return this.fetcher.post<AIBulletPointResponse>(
      '/api/resume-ai/experience-bullets',
      request,
    );
  }

  /**
   * Get skill suggestions based on job title and industry
   */
  async suggestSkills(
    request: AISkillsSuggestionRequest,
  ): Promise<AISkillsSuggestionResponse> {
    return this.fetcher.post<AISkillsSuggestionResponse>(
      '/api/resume-ai/suggest-skills',
      request,
    );
  }

  /**
   * Improve existing content with AI suggestions
   */
  async improveContent(request: AIImproveRequest): Promise<AIImproveResponse> {
    return this.fetcher.post<AIImproveResponse>(
      '/api/resume-ai/improve',
      request,
    );
  }

  /**
   * Generate project description based on project details
   */
  async generateProjectDescription(params: {
    projectName: string;
    technologies: string[];
    role?: string;
    outcomes?: string;
    userId: string;
  }): Promise<AICompletionResponse> {
    return this.fetcher.post<AICompletionResponse>(
      '/api/resume-ai/project-description',
      params,
    );
  }

  /**
   * Stream AI completion (for real-time generation)
   * Returns an EventSource URL for streaming responses
   */
  getStreamUrl(params: {
    type: AICompletionRequest['type'];
    userId: string;
  }): string {
    return `/api/resume-ai/stream?type=${params.type}&userId=${params.userId}`;
  }
}
