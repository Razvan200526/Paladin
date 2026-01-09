import type { Fetcher } from './Fetcher';
import type { ResponseType } from './types';

export type JobSource =
  | 'linkedin'
  | 'indeed'
  | 'glassdoor'
  | 'manual'
  | 'other';
export type JobType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'
  | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
export type MatchStatus = 'new' | 'viewed' | 'saved' | 'applied' | 'dismissed';

export interface JobListing {
  id: string;
  externalId?: string;
  source: JobSource;
  title: string;
  company: string;
  companyLogo?: string;
  location: string;
  isRemote: boolean;
  description: string;
  descriptionHtml?: string;
  jobType: JobType;
  experienceLevel?: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;
  url: string;
  applyUrl?: string;
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  yearsExperienceMin?: number;
  yearsExperienceMax?: number;
  educationRequirement?: string;
  benefits: string[];
  isActive: boolean;
  expiresAt?: Date;
  postedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface JobMatch {
  id: string;
  job: JobListing;
  compatibilityScore: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  keywordsScore: number;
  semanticScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: string[];
  missingKeywords: string[];
  improvementSuggestions: string[];
  status: MatchStatus;
  isNotified: boolean;
  viewedAt?: Date;
  savedAt?: Date;
  appliedAt?: Date;
  dismissedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

export interface JobPreferences {
  id: string;
  desiredTitles: string[];
  desiredLocations: string[];
  isRemotePreferred: boolean;
  isHybridOk: boolean;
  isOnsiteOk: boolean;
  minSalary?: number;
  maxSalary?: number;
  salaryCurrency: string;
  jobTypes: string[];
  experienceLevels: string[];
  preferredIndustries: string[];
  excludedIndustries: string[];
  preferredCompanies: string[];
  excludedCompanies: string[];
  skills: string[];
  notifyHighMatches: boolean;
  notifyThreshold: number;
  notifyFrequency: 'instant' | 'daily' | 'weekly';
  activeResumeId?: string;
  resumeSkills: string[];
  resumeKeywords: string[];
  yearsExperience?: number;
  educationLevel?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface JobMatchStats {
  totalMatches: number;
  newMatches: number;
  savedMatches: number;
  appliedMatches: number;
  averageScore: number;
  highMatchCount: number;
  topSkillGaps: string[];
}

export interface RefreshMatchesResult {
  newMatches: number;
  totalMatches: number;
}

export interface JobCategory {
  value: string;
  label: string;
}

export interface FetchExternalJobsResult {
  total: number;
  new: number;
  sources: Record<string, number>;
}

export class JobFetcher {
  constructor(private readonly fetcher: Fetcher) {}

  async getListings(params?: {
    search?: string;
    location?: string;
    jobType?: JobType;
    isRemote?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<ResponseType<JobListing[]>> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.location) queryParams.append('location', params.location);
    if (params?.jobType) queryParams.append('jobType', params.jobType);
    if (params?.isRemote !== undefined)
      queryParams.append('isRemote', String(params.isRemote));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    if (params?.offset) queryParams.append('offset', String(params.offset));

    const query = queryParams.toString();
    return this.fetcher.get<ResponseType<JobListing[]>>(
      `/api/jobs/listings${query ? `?${query}` : ''}`,
    );
  }

  async getListing(id: string): Promise<ResponseType<JobListing>> {
    return this.fetcher.get<ResponseType<JobListing>>(
      `/api/jobs/listings/${id}`,
    );
  }

  async createListing(data: {
    externalId?: string;
    source?: JobSource;
    title: string;
    company: string;
    companyLogo?: string;
    location: string;
    isRemote?: boolean;
    description: string;
    descriptionHtml?: string;
    jobType?: JobType;
    experienceLevel?: ExperienceLevel;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    url: string;
    applyUrl?: string;
    benefits?: string[];
    postedAt?: Date;
    expiresAt?: Date;
  }): Promise<ResponseType<JobListing>> {
    return this.fetcher.post<ResponseType<JobListing>>(
      '/api/jobs/listings',
      data,
    );
  }

  async getMatches(params: {
    userId: string;
    status?: MatchStatus | 'all';
    minScore?: number;
    limit?: number;
    offset?: number;
  }): Promise<ResponseType<JobMatch[]>> {
    const queryParams = new URLSearchParams();
    queryParams.append('userId', params.userId);
    if (params.status) queryParams.append('status', params.status);
    if (params.minScore !== undefined)
      queryParams.append('minScore', String(params.minScore));
    if (params.limit) queryParams.append('limit', String(params.limit));
    if (params.offset) queryParams.append('offset', String(params.offset));

    return this.fetcher.get<ResponseType<JobMatch[]>>(
      `/api/jobs/matches?${queryParams.toString()}`,
    );
  }

  async getMatch(id: string): Promise<ResponseType<JobMatch>> {
    return this.fetcher.get<ResponseType<JobMatch>>(`/api/jobs/matches/${id}`);
  }

  async updateMatchStatus(
    matchId: string,
    status: MatchStatus,
  ): Promise<ResponseType<JobMatch>> {
    return this.fetcher.patch<ResponseType<JobMatch>>(
      '/api/jobs/matches/status',
      {
        matchId,
        status,
      },
    );
  }

  async refreshMatches(
    userId: string,
  ): Promise<ResponseType<RefreshMatchesResult>> {
    return this.fetcher.post<ResponseType<RefreshMatchesResult>>(
      `/api/jobs/refresh-matches/${userId}`,
    );
  }

  async getMatchStats(userId: string): Promise<ResponseType<JobMatchStats>> {
    return this.fetcher.get<ResponseType<JobMatchStats>>(
      `/api/jobs/matches/stats?userId=${userId}`,
    );
  }

  async getPreferences(
    userId: string,
  ): Promise<ResponseType<JobPreferences | null>> {
    return this.fetcher.get<ResponseType<JobPreferences | null>>(
      `/api/jobs/preferences/${userId}`,
    );
  }

  async updatePreferences(data: {
    userId: string;
    desiredTitles?: string[];
    desiredLocations?: string[];
    isRemotePreferred?: boolean;
    isHybridOk?: boolean;
    isOnsiteOk?: boolean;
    minSalary?: number;
    maxSalary?: number;
    salaryCurrency?: string;
    jobTypes?: string[];
    experienceLevels?: string[];
    preferredIndustries?: string[];
    excludedIndustries?: string[];
    preferredCompanies?: string[];
    excludedCompanies?: string[];
    skills?: string[];
    notifyHighMatches?: boolean;
    notifyThreshold?: number;
    notifyFrequency?: 'instant' | 'daily' | 'weekly';
    activeResumeId?: string;
    resumeContent?: string;
    yearsExperience?: number;
    educationLevel?: string;
  }): Promise<ResponseType<JobPreferences>> {
    return this.fetcher.put<ResponseType<JobPreferences>>(
      '/api/jobs/preferences',
      data,
    );
  }

  async getCategories(): Promise<ResponseType<JobCategory[]>> {
    return this.fetcher.get<ResponseType<JobCategory[]>>(
      '/api/jobs/categories',
    );
  }

  async fetchExternalJobs(data: {
    categories?: string[];
    limit?: number;
  }): Promise<ResponseType<FetchExternalJobsResult>> {
    return this.fetcher.post<ResponseType<FetchExternalJobsResult>>(
      '/api/jobs/fetch-external',
      data,
    );
  }
}
