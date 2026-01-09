/**
 * Resume AI Controller
 * Provides AI-powered content generation for resume building
 */
import { controller, inject, logger, post } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { UserRepository } from '../repositories/UserRepository';
import type { ApiResponse } from '../sdk/types';
import { ResumeAIService } from '../services/ResumeAIService';

@controller('/api/resume-ai')
export class ResumeAIController {
  constructor(
    @inject(ResumeAIService) private readonly resumeAIService: ResumeAIService,
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  /**
   * POST /api/resume-ai/generate-summary
   * Generate a professional summary based on job title and experience
   */
  @post('/generate-summary')
  async generateSummary(
    c: Context,
  ): Promise<ApiResponse<{ content: string } | null>> {
    try {
      const { userId, jobTitle, yearsOfExperience, skills, industry } =
        await c.req.json();

      if (!userId || !jobTitle) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId and jobTitle are required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      logger.info(
        `[ResumeAI] Generating summary for ${jobTitle} with ${yearsOfExperience} years`,
      );

      const content = await this.resumeAIService.generateSummary({
        jobTitle,
        yearsOfExperience: yearsOfExperience || 0,
        skills,
        industry,
      });

      return apiResponse(c, {
        data: { content },
        message: 'Summary generated successfully',
      });
    } catch (e) {
      logger.error(new Error(`Generate summary error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to generate summary',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-ai/experience-bullets
   * Generate bullet points for an experience entry
   */
  @post('/experience-bullets')
  async generateExperienceBullets(
    c: Context,
  ): Promise<ApiResponse<{ bullets: string[] } | null>> {
    try {
      const { userId, position, company, responsibilities, achievements } =
        await c.req.json();

      if (!userId || !position || !company) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId, position, and company are required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      logger.info(
        `[ResumeAI] Generating experience bullets for ${position} at ${company}`,
      );

      const bullets = await this.resumeAIService.generateExperienceBullets({
        position,
        company,
        responsibilities,
        achievements,
      });

      return apiResponse(c, {
        data: { bullets },
        message: 'Experience bullets generated successfully',
      });
    } catch (e) {
      logger.error(new Error(`Generate experience bullets error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to generate experience bullets',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-ai/suggest-skills
   * Suggest skills based on job title and industry
   */
  @post('/suggest-skills')
  async suggestSkills(c: Context): Promise<
    ApiResponse<{
      categories: Array<{ name: string; skills: string[] }>;
    } | null>
  > {
    try {
      const { userId, jobTitle, industry, existingSkills } = await c.req.json();

      if (!userId || !jobTitle) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId and jobTitle are required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      logger.info(`[ResumeAI] Suggesting skills for ${jobTitle}`);

      const categories = await this.resumeAIService.suggestSkills({
        jobTitle,
        industry,
        existingSkills,
      });

      return apiResponse(c, {
        data: { categories },
        message: 'Skills suggested successfully',
      });
    } catch (e) {
      logger.error(new Error(`Suggest skills error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to suggest skills',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-ai/improve
   * Improve existing content with AI suggestions
   */
  @post('/improve')
  async improveContent(
    c: Context,
  ): Promise<ApiResponse<{ improved: string; changes: string[] } | null>> {
    try {
      const { userId, content, type } = await c.req.json();

      if (!userId || !content || !type) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId, content, and type are required',
            isClientError: true,
          },
          400,
        );
      }

      if (!['summary', 'experience', 'education', 'project'].includes(type)) {
        return apiResponse(
          c,
          {
            data: null,
            message:
              'type must be one of: summary, experience, education, project',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      logger.info(`[ResumeAI] Improving ${type} content`);

      const result = await this.resumeAIService.improveContent({
        content,
        type,
      });

      return apiResponse(c, {
        data: result,
        message: 'Content improved successfully',
      });
    } catch (e) {
      logger.error(new Error(`Improve content error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to improve content',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-ai/project-description
   * Generate a project description
   */
  @post('/project-description')
  async generateProjectDescription(
    c: Context,
  ): Promise<ApiResponse<{ content: string } | null>> {
    try {
      const { userId, projectName, technologies, role, outcomes } =
        await c.req.json();

      if (!userId || !projectName) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId and projectName are required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'User not found',
            isNotFound: true,
          },
          404,
        );
      }

      logger.info(
        `[ResumeAI] Generating project description for ${projectName}`,
      );

      const content = await this.resumeAIService.generateProjectDescription({
        projectName,
        technologies: technologies || [],
        role,
        outcomes,
      });

      return apiResponse(c, {
        data: { content },
        message: 'Project description generated successfully',
      });
    } catch (e) {
      logger.error(new Error(`Generate project description error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to generate project description',
          isServerError: true,
        },
        500,
      );
    }
  }
}
