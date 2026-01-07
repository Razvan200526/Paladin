import type { Fetcher } from './Fetcher';

/**
 * Resume Builder Data Interfaces
 */
export interface ResumeContactInfo {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

export interface ResumeExperienceEntry {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
}

export interface ResumeEducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description: string;
}

export interface ResumeSkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface ResumeProjectEntry {
  id: string;
  name: string;
  url?: string;
  technologies: string[];
  description: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  content: string;
}

export interface ResumeBuilderData {
  contact: ResumeContactInfo;
  summary?: string;
  experience: ResumeExperienceEntry[];
  education: ResumeEducationEntry[];
  skills: ResumeSkillCategory[];
  projects: ResumeProjectEntry[];
  customSections: ResumeCustomSection[];
}

export interface ResumeBuilder {
  id: string;
  name: string;
  templateId: string;
  data: ResumeBuilderData;
  status: 'draft' | 'published';
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    email: string;
    name?: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface ResumeBuilderResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PDFExportOptions {
  includeLinks?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

export class ResumeBuilderFetcher {
  private fetcher: Fetcher;

  constructor(fetcher: Fetcher) {
    this.fetcher = fetcher;
  }

  /**
   * Get all resume builders for a user
   */
  async getByUser(
    userId: string,
  ): Promise<ResumeBuilderResponse<ResumeBuilder[]>> {
    return this.fetcher.get<ResumeBuilderResponse<ResumeBuilder[]>>(
      `/api/resume-builder/user/${userId}`,
    );
  }

  /**
   * Get a single resume builder by ID
   */
  async getOne(id: string): Promise<ResumeBuilderResponse<ResumeBuilder>> {
    return this.fetcher.get<ResumeBuilderResponse<ResumeBuilder>>(
      `/api/resume-builder/${id}`,
    );
  }

  /**
   * Create a new resume builder
   */
  async create(params: {
    userId: string;
    name: string;
    templateId?: string;
    data: ResumeBuilderData;
  }): Promise<ResumeBuilderResponse<ResumeBuilder>> {
    return this.fetcher.post<ResumeBuilderResponse<ResumeBuilder>>(
      '/api/resume-builder/create',
      params,
    );
  }

  /**
   * Update an existing resume builder
   */
  async update(
    id: string,
    params: {
      userId: string;
      name?: string;
      templateId?: string;
      data?: ResumeBuilderData;
      status?: 'draft' | 'published';
    },
  ): Promise<ResumeBuilderResponse<ResumeBuilder>> {
    return this.fetcher.put<ResumeBuilderResponse<ResumeBuilder>>(
      `/api/resume-builder/update/${id}`,
      params,
    );
  }

  /**
   * Delete a resume builder
   */
  async delete(
    id: string,
    userId: string,
  ): Promise<ResumeBuilderResponse<{ success: boolean }>> {
    return this.fetcher.delete<ResumeBuilderResponse<{ success: boolean }>>(
      `/api/resume-builder/delete/${id}`,
      { userId },
    );
  }

  /**
   * Duplicate a resume builder
   */
  async duplicate(
    id: string,
    userId: string,
  ): Promise<ResumeBuilderResponse<ResumeBuilder>> {
    return this.fetcher.post<ResumeBuilderResponse<ResumeBuilder>>(
      `/api/resume-builder/duplicate/${id}`,
      { userId },
    );
  }

  /**
   * Export resume as PDF (returns HTML for browser printing)
   */
  async exportPDF(
    id: string,
    userId: string,
    options?: PDFExportOptions,
  ): Promise<Blob> {
    const response = await fetch(`/api/resume-builder/export-pdf/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, options }),
    });

    if (!response.ok) {
      throw new Error('Failed to export PDF');
    }

    return response.blob();
  }

  /**
   * Get HTML preview for a resume
   */
  async getPreviewHTML(
    id: string,
    userId: string,
    options?: PDFExportOptions,
  ): Promise<string> {
    const response = await fetch(`/api/resume-builder/preview-html/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, options }),
    });

    if (!response.ok) {
      throw new Error('Failed to get preview');
    }

    return response.text();
  }

  /**
   * Generate PDF from data without saving (for preview/download)
   */
  async generatePDFFromData(params: {
    userId: string;
    data: ResumeBuilderData;
    templateId?: string;
    name?: string;
    options?: PDFExportOptions;
  }): Promise<Blob> {
    const response = await fetch('/api/resume-builder/generate-pdf', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
    }

    return response.blob();
  }

  /**
   * Download PDF - opens in new window for printing
   */
  async downloadPDF(
    id: string,
    userId: string,
    options?: PDFExportOptions,
  ): Promise<void> {
    const blob = await this.exportPDF(id, userId, options);
    const url = URL.createObjectURL(blob);

    // Open in new window for printing
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  /**
   * Download PDF from data - opens in new window for printing
   */
  async downloadPDFFromData(params: {
    userId: string;
    data: ResumeBuilderData;
    templateId?: string;
    name?: string;
    options?: PDFExportOptions;
  }): Promise<void> {
    const blob = await this.generatePDFFromData(params);
    const url = URL.createObjectURL(blob);

    // Open in new window for printing
    const printWindow = window.open(url, '_blank');
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }
}
