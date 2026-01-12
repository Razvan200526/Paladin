import type { UpdateUserModel } from '@paladin/models/UpdateUserModel';
import { controller, get, inject, logger, post, put } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { CoverletterRepository } from '../repositories/CoverletterRepository';
import { ResumeRepository } from '../repositories/ResumeRepository';
import { UserRepository } from '../repositories/UserRepository';
import type { ApiResponse } from '../sdk/types';
import { StorageService } from '../services/StorageService';

@controller('/api/users')
export class UsersController {
  constructor(
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(ResumeRepository) private readonly resumeRepo: ResumeRepository,
    @inject(CoverletterRepository)
    private readonly coverletterRepo: CoverletterRepository,
    @inject(StorageService) private readonly storageService: StorageService,
  ) {}

  @get('/exists')
  async checkExists(
    c: Context,
  ): Promise<ApiResponse<{ exists: boolean } | null>> {
    try {
      const email = c.req.query('email');
      if (!email) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Email is required',
            isClientError: true,
          },
          400,
        );
      }

      const user = await this.userRepo.findByEmail(email);

      return apiResponse(c, {
        data: { exists: !!user },
        message: 'User check completed',
      });
    } catch (e) {
      console.error('Check user exists error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to check user',
          isServerError: true,
        },
        500,
      );
    }
  }

  @get()
  @put('/update/:id')
  async updateUser(c: Context): Promise<ApiResponse<string | null>> {
    try {
      const userId = c.req.param('id');
      const payload = await c.req.json<UpdateUserModel>();

      const { name, email, firstName, lastName, image , profession ,bio} = payload;

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

      if (name && name !== '') user.name = name;
      if (email && email !== '') user.email = email;
      if (profession && profession !== '') user.profession = profession;
      if (firstName && firstName !== '') user.firstName = firstName;
      if (lastName && lastName !== '') user.lastName = lastName;
      if (image && image !== '') user.image = image;
      if(bio && bio !== '') user.bio = bio;
      const updatedUser = await this.userRepo.update(user);

      return apiResponse(c, {
        data: updatedUser.id,
        success: true,
        message: 'User updated successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to update user',
          isServerError: true,
        },
        500,
      );
    }
  }
  // GET /api/users/:id/resumes
  @get('/:id/resumes')
  async getResumes(c: Context): Promise<ApiResponse<any[] | null>> {
    try {
      const userId = c.req.param('id');

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
        message: 'User resumes retrieved successfully',
      });
    } catch (e) {
      console.error('Get user resumes error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve user resumes',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/users/:id/coverletters
  @get('/:id/coverletters')
  async getCoverletters(c: Context): Promise<ApiResponse<any[] | null>> {
    try {
      const userId = c.req.param('id');

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
        message: 'User coverletters retrieved successfully',
      });
    } catch (e) {
      console.error('Get user coverletters error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve user coverletters',
          isServerError: true,
        },
        500,
      );
    }
  }

  // POST /api/users/avatar/upload
  @post('/avatar/upload')
  async uploadAvatar(c: Context): Promise<ApiResponse<{ url: string } | null>> {
    try {
      const formData = await c.req.formData();
      const file = formData.get('file') as File;
      const userId = formData.get('userId') as string;

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

      const url = await this.storageService.uploadAvatar(file);

      user.image = url;
      await this.userRepo.update(user);

      return apiResponse(c, {
        data: { url },
        message: 'Avatar uploaded successfully',
      });
    } catch (e) {
      console.error('Upload avatar error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to upload avatar',
          isServerError: true,
        },
        500,
      );
    }
  }
}
