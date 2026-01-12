import { apiResponse } from '@paladin/client';
import { JobListingEntity } from '@paladin/entities';
import { JobListingRepository } from '@paladin/repositories/JobListingRepository';
import { JobMatchRepository } from '@paladin/repositories/JobMatchRepository';
import { UserJobPreferencesRepository } from '@paladin/repositories/UserJobPreferenceRepository';
import { CacheService, JobFetchingService } from '@paladin/services';
import {
  controller,
  get,
  inject,
  logger,
  patch,
  post,
  put,
} from '@razvan11/paladin';
import type { Context } from 'hono';

const LISTINGS_CACHE_TTL = 60 * 15; // 15 minutes
const LISTING_CACHE_TTL = 60 * 30; // 30 minutes
const PREFERENCES_CACHE_TTL = 60 * 60; // 1 hour
const CATEGORIES_CACHE_TTL = 60 * 60 * 24; // 24 hours
const MATCH_STATS_CACHE_TTL = 60 * 5; // 5 minutes

@controller('/api/jobs')
export class JobsController {
  constructor(
    @inject(JobFetchingService) private jobs: JobFetchingService,
    @inject(JobMatchRepository) private matches: JobMatchRepository,
    @inject(UserJobPreferencesRepository)
    private preferences: UserJobPreferencesRepository,
    @inject(JobListingRepository) private listings: JobListingRepository,
    @inject(CacheService) private cache: CacheService,
  ) {}

  /**
   * Generate cache key for job listings search
   */
  private getListingsCacheKey(params: Record<string, unknown>): string {
    const key = Object.entries(params)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}=${v}`)
      .join('&');
    return `jobs:listings:${key || 'all'}`;
  }

  /**
   * Generate cache key for a single listing
   */
  private getListingCacheKey(id: string): string {
    return `jobs:listing:${id}`;
  }

  /**
   * Generate cache key for user preferences
   */
  private getPreferencesCacheKey(userId: string): string {
    return `jobs:preferences:${userId}`;
  }

  /**
   * Generate cache key for match stats
   */
  private getMatchStatsCacheKey(userId: string): string {
    return `jobs:matchStats:${userId}`;
  }

  // GET /api/jobs/listings
  @get('/listings')
  async getListings(c: Context) {
    try {
      const search = c.req.query('search');
      const location = c.req.query('location');
      const jobType = c.req.query('jobType');
      const isRemote = c.req.query('isRemote');
      const limit = Number(c.req.query('limit')) || 20;
      const offset = Number(c.req.query('offset')) || 0;

      const cacheKey = this.getListingsCacheKey({
        search,
        location,
        jobType,
        isRemote,
        limit,
        offset,
      });

      const cached = await this.cache.get<JobListingEntity[]>(cacheKey);
      if (cached) {
        logger.info(`[JobsController] Cache hit for listings: ${cacheKey}`);
        return apiResponse(c, {
          data: cached,
          message: 'Job listings retrieved successfully (cached)',
        });
      }

      const jobs = await this.listings.findAll({
        search,
        location,
        jobType,
        isRemote:
          isRemote === 'true' ? true : isRemote === 'false' ? false : undefined,
        limit,
        offset,
      });

      await this.cache.set(cacheKey, jobs, LISTINGS_CACHE_TTL);

      return apiResponse(c, {
        data: jobs,
        message: 'Job listings retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve job listings' },
        500,
      );
    }
  }

  // GET /api/jobs/listings/:id
  @get('/listings/:id')
  async getListing(c: Context) {
    try {
      const id = c.req.param('id');
      const cacheKey = this.getListingCacheKey(id);

      const cached = await this.cache.get<JobListingEntity>(cacheKey);
      if (cached) {
        return apiResponse(c, {
          data: cached,
          message: 'Job listing retrieved successfully (cached)',
        });
      }

      const job = await this.listings.findById(id);

      if (!job) {
        return apiResponse(
          c,
          { data: null, message: 'Job listing not found', isNotFound: true },
          404,
        );
      }

      await this.cache.set(cacheKey, job, LISTING_CACHE_TTL);

      return apiResponse(c, {
        data: job,
        message: 'Job listing retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve job listing' },
        500,
      );
    }
  }

  // POST /api/jobs/listings
  @post('/listings')
  async createListing(c: Context) {
    try {
      const body = await c.req.json();

      const { title, company, location, description, url } = body;

      if (!title || !company || !location || !description || !url) {
        return apiResponse(
          c,
          {
            data: null,
            message: 'Missing required fields',
            isClientError: true,
          },
          400,
        );
      }
      const listing = new JobListingEntity();
      listing.title = title;
      listing.company = company;
      listing.companyLogo = body.companyLogo;
      listing.location = location;
      listing.isRemote = body.isRemote ?? false;
      listing.description = description;
      listing.descriptionHtml = body.descriptionHtml;
      listing.jobType = body.jobType ?? 'full-time';
      listing.experienceLevel = body.experienceLevel;
      listing.salaryMin = body.salaryMin;
      listing.salaryMax = body.salaryMax;
      listing.salaryCurrency = body.salaryCurrency ?? 'USD';
      listing.url = url;
      listing.applyUrl = body.applyUrl;
      listing.requiredSkills = body.requiredSkills ?? [];
      listing.preferredSkills = body.preferredSkills ?? [];
      listing.keywords = body.keywords ?? [];
      listing.yearsExperienceMin = body.yearsExperienceMin;
      listing.yearsExperienceMax = body.yearsExperienceMax;
      listing.educationRequirement = body.educationRequirement;
      listing.benefits = body.benefits ?? [];
      listing.source = body.source ?? 'manual';
      listing.externalId = body.externalId;
      listing.postedAt = body.postedAt ? new Date(body.postedAt) : new Date();
      listing.expiresAt = body.expiresAt ? new Date(body.expiresAt) : undefined;

      const saved = await this.listings.create(listing);

      await this.cache.deletePattern('jobs:listings:*');

      logger.info(`Job listing created successfully: ${saved.id}`);

      return apiResponse(
        c,
        {
          data: saved,
          message: 'Job listing created successfully',
        },
        201,
      );
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to create job listing' },
        500,
      );
    }
  }

  // GET /api/jobs/matches (query: userId, status, minScore, limit, offset)
  @get('/matches')
  async getMatches(c: Context) {
    try {
      const userId = c.req.query('userId');
      const status = c.req.query('status');
      const minScore = c.req.query('minScore');
      const limit = Number(c.req.query('limit')) || 50;
      const offset = Number(c.req.query('offset')) || 0;

      if (!userId) {
        return apiResponse(
          c,
          { data: null, message: 'userId is required' },
          400,
        );
      }

      const matches = await this.matches.findByUserId(userId, {
        status: status === 'all' ? undefined : status,
        minScore: minScore ? Number(minScore) : undefined,
        limit,
        offset,
      });

      return apiResponse(c, {
        data: matches,
        message: 'Job matches retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve job matches' },
        500,
      );
    }
  }

  // GET /api/jobs/matches/stats (query: userId)
  @get('/matches/stats')
  async getMatchStats(c: Context) {
    try {
      const userId = c.req.query('userId');

      if (!userId) {
        return apiResponse(
          c,
          { data: null, message: 'userId is required' },
          400,
        );
      }

      const cacheKey = this.getMatchStatsCacheKey(userId);

      const cached = await this.cache.get(cacheKey);
      if (cached) {
        return apiResponse(c, {
          data: cached,
          message: 'Match stats retrieved successfully (cached)',
        });
      }

      const [stats, averageScore, highMatchCount, topSkillGaps] =
        await Promise.all([
          this.matches.getStatsByUserId(userId),
          this.matches.getAverageScoreByUserId(userId),
          this.matches.getHighMatchCountByUserId(userId, 70),
          this.matches.getTopSkillGapsByUserId(userId, 5),
        ]);

      const data = {
        totalMatches: stats.total,
        newMatches: stats.new,
        savedMatches: stats.saved,
        appliedMatches: stats.applied,
        averageScore: Math.round(averageScore * 100) / 100,
        highMatchCount,
        topSkillGaps,
      };

      await this.cache.set(cacheKey, data, MATCH_STATS_CACHE_TTL);

      return apiResponse(c, {
        data,
        message: 'Match stats retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve match stats' },
        500,
      );
    }
  }

  // GET /api/jobs/matches/:id
  @get('/matches/:id')
  async getMatch(c: Context) {
    try {
      const id = c.req.param('id');
      const match = await this.matches.findById(id);

      if (!match) {
        return apiResponse(
          c,
          { data: null, message: 'Match not found', isNotFound: true },
          404,
        );
      }

      return apiResponse(c, {
        data: match,
        message: 'Job match retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve job match' },
        500,
      );
    }
  }

  // PATCH /api/jobs/matches/status (body: matchId, status)
  @patch('/matches/status')
  async updateMatchStatus(c: Context) {
    try {
      const { matchId, status, userId } = await c.req.json();

      if (!matchId || !status) {
        return apiResponse(
          c,
          { data: null, message: 'matchId and status are required' },
          400,
        );
      }

      const updated = await this.matches.updateStatus(matchId, status);

      if (!updated) {
        return apiResponse(
          c,
          { data: null, message: 'Match not found', isNotFound: true },
          404,
        );
      }

      if (userId) {
        await this.cache.delete(this.getMatchStatsCacheKey(userId));
      }

      return apiResponse(c, {
        data: updated,
        message: 'Match status updated successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to update match status' },
        500,
      );
    }
  }

  // POST /api/jobs/refresh-matches/:userId
  @post('/refresh-matches/:userId')
  async refreshMatches(c: Context) {
    try {
      const userId = c.req.param('userId');
      const result = await this.matches.refreshMatchesForUser(userId);

      await this.cache.delete(this.getMatchStatsCacheKey(userId));

      return apiResponse(c, {
        data: {
          newMatches: result.newMatches,
          totalMatches: result.totalMatches,
        },
        message: 'Matches refreshed successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to refresh matches' },
        500,
      );
    }
  }

  // GET /api/jobs/preferences/:userId
  @get('/preferences/:userId')
  async getPreferences(c: Context) {
    try {
      const userId = c.req.param('userId');
      const cacheKey = this.getPreferencesCacheKey(userId);

      const cached = await this.cache.get(cacheKey);
      if (cached) {
        logger.info(`[JobsController] Cache hit for preferences: ${userId}`);
        return apiResponse(c, {
          data: cached,
          message: 'Preferences retrieved successfully (cached)',
        });
      }

      const preferences = await this.preferences.findByUserId(userId);
      logger.info(`Retrieved preferences for user ${userId}`);

      await this.cache.set(cacheKey, preferences ?? null, PREFERENCES_CACHE_TTL);

      return apiResponse(c, {
        data: preferences ?? null,
        message: 'Preferences retrieved successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to retrieve preferences' },
        500,
      );
    }
  }

  // PUT /api/jobs/preferences (body: userId + preferences data)
  @put('/preferences')
  async updatePreferences(c: Context) {
    try {
      const body = await c.req.json();
      const { userId, ...preferencesData } = body;

      if (!userId) {
        return apiResponse(
          c,
          { data: null, message: 'userId is required' },
          400,
        );
      }

      const preferences = await this.preferences.upsert(
        userId,
        preferencesData,
      );

      await this.cache.delete(this.getPreferencesCacheKey(userId));
      await this.cache.delete(this.getMatchStatsCacheKey(userId));

      return apiResponse(c, {
        data: preferences,
        message: 'Preferences updated successfully',
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to update preferences' },
        500,
      );
    }
  }

  // GET /api/jobs/categories
  @get('/categories')
  async getCategories(c: Context) {
    const cacheKey = 'jobs:categories';

    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return apiResponse(c, {
        data: cached,
        message: 'Categories retrieved successfully (cached)',
      });
    }

    const categories = [
      { value: 'software-dev', label: 'Software Development' },
      { value: 'data', label: 'Data Science & Analytics' },
      { value: 'devops', label: 'DevOps & Infrastructure' },
      { value: 'design', label: 'Design & UX' },
      { value: 'product', label: 'Product Management' },
      { value: 'marketing', label: 'Marketing' },
      { value: 'sales', label: 'Sales' },
      { value: 'finance', label: 'Finance' },
      { value: 'other', label: 'Other' },
    ];

    await this.cache.set(cacheKey, categories, CATEGORIES_CACHE_TTL);

    return apiResponse(c, {
      data: categories,
      message: 'Categories retrieved successfully',
    });
  }

  // POST /api/jobs/fetch-external
  @post('/fetch-external')
  async fetchExternal(c: Context) {
    try {
      const body = await c.req.json();
      const limit = Math.min(Math.max(body.limit || 50, 1), 100);
      const { categories } = body;

      if (!categories) {
        return apiResponse(
          c,
          { data: null, message: 'Categories are required' },
          400,
        );
      }

      const jobs = await this.jobs.fetchAndSaveJobs({ categories, limit });

      await this.cache.deletePattern('jobs:listings:*');

      return apiResponse(c, {
        data: jobs,
        message: `Fetched ${jobs.new} applications`,
      });
    } catch (e) {
      logger.error(e as Error);
      return apiResponse(
        c,
        { data: null, message: 'Failed to fetch external jobs' },
        500,
      );
    }
  }
}
