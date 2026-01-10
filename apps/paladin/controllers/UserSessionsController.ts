import { controller, del, get, inject, post, put } from '@razvan11/paladin';
import type { Context } from 'hono';
import { apiResponse } from '../client';
import { UserSessionEntity } from '../entities/UserSessionEntity';
import { UserRepository } from '../repositories/UserRepository';
import { UserSessionRepository } from '../repositories/UserSessionRepository';
import type { ApiResponse } from '../sdk/types';

@controller('/api/user-sessions')
export class UserSessionsController {
  constructor(
    @inject(UserSessionRepository)
    private readonly sessionRepo: UserSessionRepository,
    @inject(UserRepository) private readonly userRepo: UserRepository,
  ) {}

  // POST /api/user-sessions
  @post('/')
  async create(c: Context): Promise<ApiResponse<UserSessionEntity | null>> {
    try {
      const body = await c.req.json();
      const { userId, token, expiresAt, ipAddress, userAgent } = body;

      if (!userId || !token || !expiresAt) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'userId, token, and expiresAt are required',
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

      const session = new UserSessionEntity();
      session.user = user;
      session.token = token;
      session.expiresAt = new Date(expiresAt);
      if (ipAddress) session.ipAddress = ipAddress;
      if (userAgent) session.userAgent = userAgent;

      const newSession = await this.sessionRepo.create(session);

      return apiResponse(c, {
        data: newSession,
        message: 'User session created successfully',
      });
    } catch (e) {
      console.error('Create session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to create user session',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/user-sessions
  @get('/')
  async filter(c: Context): Promise<
    ApiResponse<{
      sessions: UserSessionEntity[];
      total: number;
      totalPages: number;
      page: number;
      limit: number;
    } | null>
  > {
    try {
      const query = c.req.query();
      const page = query.page ? Number.parseInt(query.page, 10) : 1;
      const limit = query.limit ? Number.parseInt(query.limit, 10) : 10;
      const offset = (page - 1) * limit;

      const {
        sortBy,
        sortOrder,
        userId,
        token,
        expiresAt,
        ipAddress,
        userAgent,
      } = query;

      const where: any = {};
      if (userId) where.user = { id: userId };
      if (token) where.token = token;
      if (expiresAt) where.expiresAt = new Date(expiresAt);
      if (ipAddress) where.ipAddress = ipAddress;
      if (userAgent) where.userAgent = userAgent; // Typically exact match, maybe like?

      const order: any = {};
      if (sortBy) {
        order[sortBy] = sortOrder === 'desc' ? 'DESC' : 'ASC';
      } else {
        order.createdAt = 'DESC';
      }

      const [sessions, total] = await (
        await this.sessionRepo.open()
      ).findAndCount({
        where,
        order,
        take: limit,
        skip: offset,
        relations: { user: true },
      });

      const totalPages = Math.ceil(total / limit);

      return apiResponse(c, {
        data: {
          sessions,
          total,
          totalPages,
          page,
          limit,
        },
        message: 'Sessions retrieved successfully',
      });
    } catch (e) {
      console.error('Filter sessions error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve sessions',
          isServerError: true,
        },
        500,
      );
    }
  }

  // GET /api/user-sessions/:id
  @get('/:id')
  async retrieve(c: Context): Promise<ApiResponse<UserSessionEntity | null>> {
    try {
      const id = c.req.param('id');
      const session = await this.sessionRepo.findOne(id);

      if (!session) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      return apiResponse(c, {
        data: session,
        message: 'Session retrieved successfully',
      });
    } catch (e) {
      console.error('Retrieve session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to retrieve session',
          isServerError: true,
        },
        500,
      );
    }
  }

  // PUT /api/user-sessions/:id
  @put('/:id')
  async update(c: Context): Promise<ApiResponse<UserSessionEntity | null>> {
    try {
      const id = c.req.param('id');
      const body = await c.req.json();
      const { token, expiresAt, ipAddress, userAgent } = body;

      const session = await this.sessionRepo.findOne(id);
      if (!session) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      if (token) session.token = token;
      if (expiresAt) session.expiresAt = new Date(expiresAt);
      if (ipAddress) session.ipAddress = ipAddress;
      if (userAgent) session.userAgent = userAgent;

      const updatedSession = await this.sessionRepo.update(session);

      return apiResponse(c, {
        data: updatedSession,
        message: 'Session updated successfully',
      });
    } catch (e) {
      console.error('Update session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to update session',
          isServerError: true,
        },
        500,
      );
    }
  }

  // DELETE /api/user-sessions/:id
  @del('/:id')
  async delete(c: Context): Promise<ApiResponse<{ success: boolean } | null>> {
    try {
      const id = c.req.param('id');

      // Check if exists first? Or just delete.
      // Usually good to check to return 404 if not found, but not strictly required.
      const session = await this.sessionRepo.findOne(id);
      if (!session) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Session not found',
            isNotFound: true,
          },
          404,
        );
      }

      await this.sessionRepo.delete({ id });

      return apiResponse(c, {
        data: { success: true },
        message: 'Session deleted successfully',
      });
    } catch (e) {
      console.error('Delete session error:', e);
      return apiResponse(
        c,
        {
          data: null,
          message: 'Failed to delete session',
          isServerError: true,
        },
        500,
      );
    }
  }
}
