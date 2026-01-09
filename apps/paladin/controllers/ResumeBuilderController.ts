/**
 * Resume Builder Controller
 * Provides endpoints for saving, loading, and exporting resume builder data
 */
import {
  controller,
  del,
  get,
  inject,
  logger,
  post,
  put,
} from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { ResumeBuilderEntity } from '../entities/ResumeBuilderEntity';
import { ResumeBuilderRepository } from '../repositories/ResumeBuilderRepository';
import { UserRepository } from '../repositories/UserRepository';
import type { ApiResponse } from '../sdk/types';
import { ResumePDFService } from '../services/ResumePDFService';

@controller('/api/resume-builder')
export class ResumeBuilderController {
  constructor(
    @inject(ResumeBuilderRepository)
    private readonly resumeBuilderRepo: ResumeBuilderRepository,
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(ResumePDFService) private readonly pdfService: ResumePDFService,
  ) {}

  /**
   * GET /api/resume-builder/user/:userId
   * Get all resume builders for a user
   */
  @get('/user/:userId')
  async getByUser(
    c: Context,
  ): Promise<ApiResponse<ResumeBuilderEntity[] | null>> {
    try {
      const userId = c.req.param('userId');

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

      const resumeBuilders = await this.resumeBuilderRepo.findByUserId(userId);

      return apiResponse(c, {
        data: resumeBuilders,
        message: 'Resume builders retrieved successfully',
      });
    } catch (e) {
      logger.error(new Error(`Get resume builders error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve resume builders',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * GET /api/resume-builder/:id
   * Get a single resume builder by ID
   */
  @get('/:id')
  async getOne(c: Context): Promise<ApiResponse<ResumeBuilderEntity | null>> {
    try {
      const id = c.req.param('id');

      const resumeBuilder = await this.resumeBuilderRepo.findOne(id);
      if (!resumeBuilder) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume builder not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: resumeBuilder,
        message: 'Resume builder retrieved successfully',
      });
    } catch (e) {
      logger.error(new Error(`Get resume builder error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve resume builder',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-builder/create
   * Create a new resume builder
   */
  @post('/create')
  async create(c: Context): Promise<ApiResponse<ResumeBuilderEntity | null>> {
    try {
      const { userId, name, templateId, data } = await c.req.json();

      if (!userId || !name || !data) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId, name, and data are required',
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

      const resumeBuilder = new ResumeBuilderEntity();
      resumeBuilder.user = user;
      resumeBuilder.name = name;
      resumeBuilder.templateId = templateId || 'classic';
      resumeBuilder.data = data;
      resumeBuilder.status = 'draft';

      const saved = await this.resumeBuilderRepo.create(resumeBuilder);

      logger.info(
        `[ResumeBuilder] Created resume builder ${saved.id} for user ${userId}`,
      );

      return apiResponse(
        c,
        {
          data: saved,
          message: 'Resume builder created successfully',
        },
        201,
      );
    } catch (e) {
      logger.error(new Error(`Create resume builder error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create resume builder',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * PUT /api/resume-builder/update/:id
   * Update an existing resume builder
   */
  @put('/update/:id')
  async update(c: Context): Promise<ApiResponse<ResumeBuilderEntity | null>> {
    try {
      const id = c.req.param('id');
      const { userId, name, templateId, data, status } = await c.req.json();

      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId is required',
            isClientError: true,
          },
          400,
        );
      }

      const resumeBuilder = await this.resumeBuilderRepo.findByUserIdAndId(
        userId,
        id,
      );
      if (!resumeBuilder) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume builder not found or unauthorized',
            isNotFound: true,
          },
          404,
        );
      }

      if (name !== undefined) resumeBuilder.name = name;
      if (templateId !== undefined) resumeBuilder.templateId = templateId;
      if (data !== undefined) resumeBuilder.data = data;
      if (status !== undefined) resumeBuilder.status = status;

      const updated = await this.resumeBuilderRepo.update(resumeBuilder);

      logger.info(`[ResumeBuilder] Updated resume builder ${id}`);

      return apiResponse(c, {
        data: updated,
        message: 'Resume builder updated successfully',
      });
    } catch (e) {
      logger.error(new Error(`Update resume builder error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to update resume builder',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * DELETE /api/resume-builder/delete/:id
   * Delete a resume builder
   */
  @del('/delete/:id')
  async delete(c: Context): Promise<ApiResponse<{ success: boolean } | null>> {
    try {
      const id = c.req.param('id');
      const { userId } = await c.req.json();

      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId is required',
            isClientError: true,
          },
          400,
        );
      }

      const resumeBuilder = await this.resumeBuilderRepo.findByUserIdAndId(
        userId,
        id,
      );
      if (!resumeBuilder) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume builder not found or unauthorized',
            isNotFound: true,
          },
          404,
        );
      }

      await this.resumeBuilderRepo.delete({ id });

      logger.info(`[ResumeBuilder] Deleted resume builder ${id}`);

      return apiResponse(c, {
        data: { success: true },
        message: 'Resume builder deleted successfully',
      });
    } catch (e) {
      logger.error(new Error(`Delete resume builder error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to delete resume builder',
          isServerError: true,
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-builder/export-pdf/:id
   * Generate and download PDF for a resume builder
   */
  @post('/export-pdf/:id')
  async exportPDF(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id');
      const { userId, options } = await c.req.json();

      if (!userId) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'userId is required',
          },
          400,
        );
      }

      const resumeBuilder = await this.resumeBuilderRepo.findByUserIdAndId(
        userId,
        id,
      );
      if (!resumeBuilder) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'Resume builder not found or unauthorized',
          },
          404,
        );
      }

      logger.info(`[ResumeBuilder] Generating PDF for resume builder ${id}`);

      const html = this.pdfService.generateHTML(resumeBuilder.data, {
        templateId: resumeBuilder.templateId,
        includeLinks: options?.includeLinks ?? true,
        fontSize: options?.fontSize ?? 'medium',
      });

      const filename = `${resumeBuilder.name.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.html`;

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (e) {
      logger.error(new Error(`Export PDF error: ${e}`));
      return c.json(
        {
          success: false,
          data: null,
          message: 'Failed to export PDF',
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-builder/preview-html/:id
   * Get HTML preview for a resume builder (for iframe/preview)
   */
  @post('/preview-html/:id')
  async getPreviewHTML(c: Context): Promise<Response> {
    try {
      const id = c.req.param('id');
      const { userId, options } = await c.req.json();

      if (!userId) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'userId is required',
          },
          400,
        );
      }

      const resumeBuilder = await this.resumeBuilderRepo.findByUserIdAndId(
        userId,
        id,
      );
      if (!resumeBuilder) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'Resume builder not found or unauthorized',
          },
          404,
        );
      }

      const html = this.pdfService.generateHTML(resumeBuilder.data, {
        templateId: resumeBuilder.templateId,
        includeLinks: options?.includeLinks ?? true,
        fontSize: options?.fontSize ?? 'medium',
      });

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      });
    } catch (e) {
      logger.error(new Error(`Preview HTML error: ${e}`));
      return c.json(
        {
          success: false,
          data: null,
          message: 'Failed to generate preview',
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-builder/generate-pdf
   * Generate PDF from provided data (without saving)
   */
  @post('/generate-pdf')
  async generatePDFFromData(c: Context): Promise<Response> {
    try {
      const { userId, data, templateId, name, options } = await c.req.json();

      if (!userId || !data) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'userId and data are required',
          },
          400,
        );
      }

      const user = await this.userRepo.findOne(userId);
      if (!user) {
        return c.json(
          {
            success: false,
            data: null,
            message: 'User not found',
          },
          404,
        );
      }

      logger.info(
        `[ResumeBuilder] Generating PDF from data for user ${userId}`,
      );

      const html = this.pdfService.generateHTML(data, {
        templateId: templateId || 'classic',
        includeLinks: options?.includeLinks ?? true,
        fontSize: options?.fontSize ?? 'medium',
      });

      const filename = `${(name || 'Resume').replace(/[^a-zA-Z0-9]/g, '_')}.html`;

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    } catch (e) {
      logger.error(new Error(`Generate PDF from data error: ${e}`));
      return c.json(
        {
          success: false,
          data: null,
          message: 'Failed to generate PDF',
        },
        500,
      );
    }
  }

  /**
   * POST /api/resume-builder/duplicate/:id
   * Duplicate an existing resume builder
   */
  @post('/duplicate/:id')
  async duplicate(
    c: Context,
  ): Promise<ApiResponse<ResumeBuilderEntity | null>> {
    try {
      const id = c.req.param('id');
      const { userId } = await c.req.json();

      if (!userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId is required',
            isClientError: true,
          },
          400,
        );
      }

      const original = await this.resumeBuilderRepo.findByUserIdAndId(
        userId,
        id,
      );
      if (!original) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume builder not found or unauthorized',
            isNotFound: true,
          },
          404,
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

      const duplicate = new ResumeBuilderEntity();
      duplicate.user = user;
      duplicate.name = `${original.name} (Copy)`;
      duplicate.templateId = original.templateId;
      duplicate.data = JSON.parse(JSON.stringify(original.data));
      duplicate.status = 'draft';

      const saved = await this.resumeBuilderRepo.create(duplicate);

      logger.info(
        `[ResumeBuilder] Duplicated resume builder ${id} -> ${saved.id}`,
      );

      return apiResponse(
        c,
        {
          data: saved,
          message: 'Resume builder duplicated successfully',
        },
        201,
      );
    } catch (e) {
      logger.error(new Error(`Duplicate resume builder error: ${e}`));
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to duplicate resume builder',
          isServerError: true,
        },
        500,
      );
    }
  }
}
