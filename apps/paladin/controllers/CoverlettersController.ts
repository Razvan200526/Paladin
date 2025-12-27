/**
 * Coverletters Controller
 * Full implementation with apiResponse pattern
 */
import { controller, del, get, inject, post, put } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { CoverletterEntity } from '../entities/CoverletterEntity';
import { CoverletterRepository } from '../repositories/CoverletterRepository';
import { UserRepository } from '../repositories/UserRepository';
import type { ApiResponse } from '../sdk/types';
import { StorageService } from '../services/StorageService';

@controller('/api/coverletters')
export class CoverlettersController {
  constructor(
    @inject(CoverletterRepository)
    private readonly coverletterRepo: CoverletterRepository,
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(StorageService) private readonly storageService: StorageService,
  ) { }

  // GET /api/coverletters/user/:userId
  @get('/:userId')
  async getByUser(
    c: Context,
  ): Promise<ApiResponse<CoverletterEntity[] | null>> {
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

      const coverletters = await this.coverletterRepo.findByUserId(userId);

      return apiResponse(c, {
        data: coverletters,
        message: 'Coverletters retrieved successfully',
      });
    } catch (e) {
      console.error('Get coverletters error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve coverletters',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/coverletters/:id
  @get('/single/:id')
  async getOne(c: Context): Promise<ApiResponse<CoverletterEntity | null>> {
    try {
      const id = c.req.param('id');

      const coverletter = await this.coverletterRepo.findOne(id);
      if (!coverletter) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Coverletter not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: coverletter,
        message: 'Coverletter retrieved successfully',
      });
    } catch (e) {
      console.error('Get coverletter error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve coverletter',
          isServerError: true,
        },
        500,
      );
    }
  }

  // POST /api/coverletters/upload
  @post('/upload')
  async upload(
    c: Context,
  ): Promise<ApiResponse<{ coverletter: CoverletterEntity } | null>> {
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

      const url = await this.storageService.uploadCoverletter(file);

      const coverletter = new CoverletterEntity();
      coverletter.user = user;
      coverletter.name = name || file.name;
      coverletter.filename = file.name;
      coverletter.url = url;
      coverletter.filetype = file.type;
      coverletter.filesize = file.size;
      coverletter.uploadedAt = new Date();

      const savedCoverletter = await this.coverletterRepo.create(coverletter);

      return apiResponse(
        c,
        {
          data: { coverletter: savedCoverletter },
          message: 'Coverletter uploaded successfully',
        },
        201,
      );
    } catch (e) {
      console.error('Upload coverletter error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to upload coverletter',
          isServerError: true,
        },
        500,
      );
    }
  }

  // PUT /api/coverletters/rename/:id
  @put('/rename/:id')
  async rename(c: Context): Promise<ApiResponse<CoverletterEntity | null>> {
    try {
      const id = c.req.param('id');
      const { name, userId } = await c.req.json();

      const coverletter = await this.coverletterRepo.findOne(id);
      if (!coverletter) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Coverletter not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (coverletter.user?.id !== userId) {
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

      coverletter.name = name;
      const updated = await this.coverletterRepo.update(coverletter);

      return apiResponse(c, {
        data: updated,
        message: 'Coverletter renamed successfully',
      });
    } catch (e) {
      console.error('Rename coverletter error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to rename coverletter',
          isServerError: true,
        },
        500,
      );
    }
  }

  // DELETE /api/coverletters/delete
  @del('/delete')
  async delete(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; deletedCount: number }>> {
    try {
      const { coverletterIds, userId } = await c.req.json();

      if (!coverletterIds || !Array.isArray(coverletterIds)) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'coverletterIds array is required',
            isClientError: true,
          },
          400,
        );
      }

      const coverletters = await this.coverletterRepo.findByIds(coverletterIds);

      const unauthorized = coverletters.some((cl) => cl.user?.id !== userId);
      if (unauthorized) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'Unauthorized to delete some coverletters',
            isForbidden: true,
          },
          403,
        );
      }

      const result = await this.coverletterRepo.delete(
        coverletterIds.map((id: string) => ({ id })),
      );

      return apiResponse(c, {
        data: { success: true, deletedCount: result.affected || 0 },
        message: 'Coverletters deleted successfully',
      });
    } catch (e) {
      console.error('Delete coverletters error:', e);
      return apiResponse(
        c,
        {
          data: { success: false, deletedCount: 0 },
          message: 'Failed to delete coverletters',
          isServerError: true,
        },
        500,
      );
    }
  }
}
