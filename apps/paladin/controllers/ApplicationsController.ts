/**
 * Applications Controller
 * Full implementation migrated from easyres with apiResponse pattern
 */
import { controller, del, get, inject, post, put } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import {
  ApplicationEntity,
  CoverletterEntity,
  ResumeEntity,
} from '../entities';
import { DeleteApplicationModel, UpdateApplicationModel } from '../models';
import { ApplicationRepository } from '../repositories/ApplicationRepository';
import { UserRepository } from '../repositories/UserRepository';
import type { ApiResponse, CreateApplicationType } from '../sdk/types';
import { PrimaryDatabase } from '../shared/database/PrimaryDatabase';

type ApplicationStatus = 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';

type UpdateApplicationPayload = {
  userId: string;
  data: {
    employer?: string;
    jobTitle?: string;
    location?: string;
    jobUrl?: string | null;
    salaryRange?: string | null;
    currency?: string;
    contact?: string | null;
    platform?: 'Linkedin' | 'Glassdoor' | 'Other';
    status?: ApplicationStatus;
    resumeId?: string;
    coverletterId?: string;
    newComment?: string;
  };
};

@controller('/api/applications')
export class ApplicationsController {
  constructor(
    @inject(PrimaryDatabase) private readonly db: PrimaryDatabase,
    @inject(UserRepository) private readonly userRepo: UserRepository,
    @inject(ApplicationRepository)
    private readonly appRepo: ApplicationRepository,
  ) { }

  // POST /api/applications/create
  @post('/create')
  async create(
    c: Context,
  ): Promise<ApiResponse<{ newApplication: ApplicationEntity } | null>> {
    const body = (await c.req.json()) as CreateApplicationType;
    const { data, userId } = body;

    try {
      const applicationRepository = await this.db.open(ApplicationEntity);

      const user = await this.userRepo.findOneOrFail(userId);
      if (user.id !== userId) {
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

      const appEntity = new ApplicationEntity();
      appEntity.user = user;
      appEntity.employer = data.employer;
      appEntity.jobTitle = data.jobTitle;
      appEntity.jobUrl = data.jobUrl;
      appEntity.salaryRange = data.salaryRange;
      appEntity.currency = data.currency || 'USD';
      appEntity.contact = data.contact;
      appEntity.location = data.location;
      appEntity.platform = data.platform as 'Linkedin' | 'Glassdoor' | 'Other';
      appEntity.status = data.status as ApplicationStatus;

      if (data.resumeId && data.resumeId !== 'none') {
        const resumeRepository = await this.db.open(ResumeEntity);
        const resume = await resumeRepository.findOne({
          where: { id: data.resumeId },
        });
        if (resume) {
          appEntity.resume = resume;
        }
      }

      if (data.coverletterId && data.coverletterId !== 'none') {
        const coverletterRepository = await this.db.open(CoverletterEntity);
        const coverletter = await coverletterRepository.findOne({
          where: { id: data.coverletterId },
        });
        if (coverletter) {
          appEntity.coverletter = coverletter;
        }
      }

      const newApplication = applicationRepository.create(appEntity);
      await applicationRepository.save(newApplication);

      return apiResponse(c, {
        data: { newApplication },
        message: 'Application created successfully',
      });
    } catch (e) {
      console.error('Create application error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create application',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/applications/:id
  @get('/:id')
  async retrieveAll(
    c: Context,
  ): Promise<ApiResponse<ApplicationEntity[] | null>> {
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

      const applications = await this.appRepo.findByUser(userId);

      return apiResponse(c, {
        data: applications,
        message: 'Applications retrieved successfully',
      });
    } catch (e) {
      console.error('Retrieve applications error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve applications',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/applications/single/:id
  @get('/single/:id')
  async getOne(c: Context): Promise<ApiResponse<ApplicationEntity | null>> {
    try {
      const id = c.req.param('id');

      const application = await this.appRepo.findOne(id);
      if (!application) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Application not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: application,
        message: 'Application retrieved successfully',
      });
    } catch (e) {
      console.error('Get application error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve application',
          isServerError: true,
        },
        500,
      );
    }
  }

  // DELETE /api/applications/delete
  @del('/delete')
  async delete(
    c: Context,
  ): Promise<ApiResponse<{ success: boolean; deletedCount: number }>> {
    try {
      const body = await c.req.json();

      const validation = DeleteApplicationModel.safeParse(body);
      if (!validation.success) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: `Validation error: ${validation.error.message}`,
            isClientError: true,
          },
          400,
        );
      }

      const { applicationIds, userId } = validation.data;

      const appRepo = await this.db.open(ApplicationEntity);
      const applications = await appRepo.find({
        where: applicationIds.map((id) => ({ id })),
        relations: ['user'],
      });

      if (applications.length === 0) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message: 'No applications found',
            isNotFound: true,
          },
          404,
        );
      }

      const unauthorized = applications.some((app) => app.user.id !== userId);
      if (unauthorized) {
        return apiResponse(
          c,
          {
            data: { success: false, deletedCount: 0 },
            message:
              'Unauthorized: Cannot delete applications that do not belong to you',
            isForbidden: true,
          },
          403,
        );
      }

      const result = await appRepo.delete(applicationIds);

      return apiResponse(c, {
        data: {
          success: true,
          deletedCount: result.affected || 0,
        },
        message: `Successfully deleted ${result.affected || 0} application(s)`,
      });
    } catch (e) {
      console.error('Delete applications error:', e);
      return apiResponse(
        c,
        {
          data: { success: false, deletedCount: 0 },
          message: 'Failed to delete applications',
          isServerError: true,
        },
        500,
      );
    }
  }

  // PUT /api/applications/update/:id
  @put('/update/:id')
  async update(
    c: Context,
  ): Promise<ApiResponse<{ application: ApplicationEntity } | null>> {
    try {
      const applicationId = c.req.param('id');
      const body = (await c.req.json()) as UpdateApplicationPayload;
      const { userId, data } = body;

      const validation = UpdateApplicationModel.safeParse(data);
      if (!validation.success) {
        return apiResponse(
          c,
          {
            data: null,
            message: validation.error.issues[0]?.message || 'Invalid data',
            isClientError: true,
          },
          400,
        );
      }

      const existingApplication = await this.appRepo.findOne(applicationId);
      if (!existingApplication) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Application not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (existingApplication.user?.id !== userId) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Unauthorized to update this application',
            isUnauthorized: true,
          },
          401,
        );
      }

      const updateData: Partial<ApplicationEntity> = {};

      if (data.employer !== undefined) updateData.employer = data.employer;
      if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle;
      if (data.location !== undefined) updateData.location = data.location;
      if (data.jobUrl !== undefined) updateData.jobUrl = data.jobUrl;
      if (data.salaryRange !== undefined)
        updateData.salaryRange = data.salaryRange;
      if (data.currency !== undefined) updateData.currency = data.currency;
      if (data.contact !== undefined) updateData.contact = data.contact;
      if (data.platform !== undefined) updateData.platform = data.platform;
      if (data.status !== undefined) updateData.status = data.status;

      if (data.newComment) {
        updateData.comments = [
          ...(existingApplication.comments || []),
          data.newComment,
        ];
      }

      if (data.resumeId !== undefined) {
        if (data.resumeId === 'none' || data.resumeId === '') {
          updateData.resume = undefined;
        } else {
          const resumeRepository = await this.db.open(ResumeEntity);
          const resume = await resumeRepository.findOne({
            where: { id: data.resumeId },
          });
          if (resume) {
            updateData.resume = resume;
          }
        }
      }

      if (data.coverletterId !== undefined) {
        if (data.coverletterId === 'none' || data.coverletterId === '') {
          updateData.coverletter = undefined;
        } else {
          const coverletterRepository = await this.db.open(CoverletterEntity);
          const coverletter = await coverletterRepository.findOne({
            where: { id: data.coverletterId },
          });
          if (coverletter) {
            updateData.coverletter = coverletter;
          }
        }
      }

      const updatedApplication = await this.appRepo.update(
        applicationId,
        updateData,
      );

      return apiResponse(c, {
        data: { application: updatedApplication },
        message: 'Application updated successfully',
      });
    } catch (e) {
      console.error('Update application error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to update application',
          isServerError: true,
        },
        500,
      );
    }
  }
}
