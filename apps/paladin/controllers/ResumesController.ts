/**
 * Resumes Controller
 * Full implementation with apiResponse pattern
 */
import { controller, get, post, put, del, inject } from '@razvan11/paladin';
import { apiResponse } from '../client';
import { ResumeEntity } from '../entities/ResumeEntity';
import type { ApiResponse } from '../sdk/types';
import type { Context } from 'hono';
import { ResumeRepository } from '../repositories/ResumeRepository';
import { UserRepository } from '../repositories/UserRepository';
import { StorageService } from '../services/StorageService';

@controller('/api/resumes')
export class ResumesController {
  constructor(
    @inject(ResumeRepository) private readonly resumeRepo: ResumeRepository,
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(StorageService) private readonly storageService: StorageService,
  ) { }

  // GET /api/resumes/user/:userId
  @get('/user/:userId')
  async getByUser(c: Context): Promise<ApiResponse<ResumeEntity[] | null>> {
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

      const resumes = await this.resumeRepo.findByUserId(userId);

      return apiResponse(c, {
        data: resumes,
        message: 'Resumes retrieved successfully',
      });
    } catch (e) {
      console.error('Get resumes error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve resumes',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/resumes/:id
  @get('/:id')
  async getOne(c: Context): Promise<ApiResponse<ResumeEntity | null>> {
    try {
      const id = c.req.param('id');

      const resume = await this.resumeRepo.findOne(id);
      if (!resume) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: resume,
        message: 'Resume retrieved successfully',
      });
    } catch (e) {
      console.error('Get resume error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve resume',
          isServerError: true,
        },
        500,
      );
    }
  }

  // POST /api/resumes/upload
  @post('/upload')
  async upload(
    c: Context,
  ): Promise<ApiResponse<{ resume: ResumeEntity } | null>> {
    try {
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      const userId = formData.get('userId') as string;
      const name = formData.get('name') as string;

      if (!file || !userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'File and userId are required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findOneOrFail(userId);

      const url = await this.storageService.uploadResume(file);

      const resume = new ResumeEntity();
      resume.user = user;
      resume.name = name || file.name;
      resume.filename = file.name;
      resume.url = url;
      resume.filetype = file.type;
      resume.filesize = file.size;
      resume.uploadedAt = new Date();

      const savedResume = await this.resumeRepo.create(resume);

      return apiResponse(
        c,
        {
          data: { resume: savedResume },
          message: 'Resume uploaded successfully',
        },
        201,
      );
    } catch (e) {
      console.error('Upload resume error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to upload resume',
          isServerError: true,
        },
        500,
      );
    }
  }

  // PUT /api/resumes/rename/:id
  @put('/rename/:id')
  async rename(c: Context): Promise<ApiResponse<ResumeEntity | null>> {
    try {
      const id = c.req.param('id');
      const { name, userId } = await c.req.json();

      const resume = await this.resumeRepo.findOne(id);
      if (!resume) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Resume not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (resume.user?.id !== userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Unauthorized',
            isUnauthorized: true,
          },
          401,
        );
      }

      resume.name = name;
      const updated = await this.resumeRepo.update(resume);

      return apiResponse(c, {
        data: updated,
        message: 'Resume renamed successfully',
      });
    } catch (e) {
      console.error('Rename resume error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to rename resume',
          isServerError: true,
        },
        500,
      );
    }
  }

  // DELETE /api/resumes/delete
  @del('/delete')
  async delete(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; deletedCount: number }>> {
    try {
      const { resumeIds, userId } = await c.req.json();

      if (!resumeIds || !Array.isArray(resumeIds)) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'resumeIds array is required',
            isClientError: true,
          },
          400,
        );
      }

      const resumes = await this.resumeRepo.findByIds(resumeIds);

      const unauthorized = resumes.some((r) => r.user?.id !== userId);
      if (unauthorized) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'Unauthorized to delete some resumes',
            isForbidden: true,
          },
          403,
        );
      }

      const result = await this.resumeRepo.delete(
        resumeIds.map((id: string) => ({ id })),
      );

      return apiResponse(c, {
        data: { success: true, deletedCount: result.affected || 0 },
        message: 'Resumes deleted successfully',
      });
    } catch (e) {
      console.error('Delete resumes error:', e);
      return apiResponse(
        c,
        {
          data: { success: false, deletedCount: 0 },
          message: 'Failed to delete resumes',
          isServerError: true,
        },
        500,
      );
    }
  }
}
