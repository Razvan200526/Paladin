import { service } from '@razvan11/paladin';
import type {
  ResumeBuilderData,
  ResumeEducationEntry,
  ResumeExperienceEntry,
  ResumeProjectEntry,
  ResumeSkillCategory,
} from '../entities/ResumeBuilderEntity';

/**
 * PDF Generation options
 */
export interface PDFGenerationOptions {
  templateId: string;
  includeLinks?: boolean;
  fontSize?: 'small' | 'medium' | 'large';
}

/**
 * Template color configuration
 */
interface TemplateColors {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  headerBackground: string;
  sectionBorder: string;
}

/**
 * Get template colors based on template ID
 */
function getTemplateColors(templateId: string): TemplateColors {
  const templates: Record<string, TemplateColors> = {
    classic: {
      primary: '#1f2937',
      secondary: '#4b5563',
      accent: '#2563eb',
      text: '#111827',
      textSecondary: '#6b7280',
      headerBackground: '#ffffff',
      sectionBorder: '#d1d5db',
    },
    modern: {
      primary: '#0f172a',
      secondary: '#475569',
      accent: '#0ea5e9',
      text: '#0f172a',
      textSecondary: '#64748b',
      headerBackground: '#f8fafc',
      sectionBorder: '#e2e8f0',
    },
    minimal: {
      primary: '#18181b',
      secondary: '#52525b',
      accent: '#18181b',
      text: '#18181b',
      textSecondary: '#71717a',
      headerBackground: '#ffffff',
      sectionBorder: '#e4e4e7',
    },
    professional: {
      primary: '#1e3a5f',
      secondary: '#2d4a6f',
      accent: '#1e3a5f',
      text: '#1f2937',
      textSecondary: '#6b7280',
      headerBackground: '#1e3a5f',
      sectionBorder: '#d1d5db',
    },
    creative: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#7c3aed',
      text: '#1f2937',
      textSecondary: '#6b7280',
      headerBackground: '#7c3aed',
      sectionBorder: '#ddd6fe',
    },
  };

  return templates[templateId] || templates.classic;
}

/**
 * Format date string (e.g., "2023-06" -> "Jun 2023")
 */
function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const date = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
  );
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Strip HTML tags from content for plain text
 */
function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li>/gi, '• ')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

/**
 * Escape XML special characters
 */
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

@service()
export class ResumePDFService {
  /**
   * Generate HTML content for PDF rendering
   * This HTML will be converted to PDF using a headless browser or HTML-to-PDF library
   */
  generateHTML(data: ResumeBuilderData, options: PDFGenerationOptions): string {
    const colors = getTemplateColors(options.templateId);
    const fontSize = this.getFontSize(options.fontSize || 'medium');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeXml(data.contact.fullName || 'Resume')}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: ${fontSize.body};
      line-height: 1.5;
      color: ${colors.text};
      background: white;
    }

    .resume {
      max-width: 8.5in;
      margin: 0 auto;
      padding: 0.5in 0.6in;
    }

    /* Header */
    .header {
      text-align: center;
      padding-bottom: 16px;
      margin-bottom: 20px;
      border-bottom: 2px solid ${colors.sectionBorder};
    }

    .name {
      font-size: ${fontSize.name};
      font-weight: 700;
      color: ${colors.primary};
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }

    .contact-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      font-size: ${fontSize.small};
      color: ${colors.textSecondary};
    }

    .contact-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .links {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 6px;
      font-size: ${fontSize.small};
    }

    .links a {
      color: ${colors.accent};
      text-decoration: none;
    }

    /* Sections */
    .section {
      margin-bottom: 18px;
    }

    .section-title {
      font-size: ${fontSize.sectionTitle};
      font-weight: 700;
      color: ${colors.primary};
      text-transform: uppercase;
      letter-spacing: 0.08em;
      padding-bottom: 6px;
      margin-bottom: 12px;
      border-bottom: 1px solid ${colors.sectionBorder};
    }

    /* Experience & Education entries */
    .entry {
      margin-bottom: 14px;
    }

    .entry:last-child {
      margin-bottom: 0;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 4px;
    }

    .entry-title {
      font-size: ${fontSize.jobTitle};
      font-weight: 600;
      color: ${colors.text};
    }

    .entry-subtitle {
      font-size: ${fontSize.body};
      color: ${colors.textSecondary};
    }

    .entry-date {
      font-size: ${fontSize.small};
      color: ${colors.textSecondary};
      white-space: nowrap;
    }

    .entry-description {
      font-size: ${fontSize.body};
      color: ${colors.textSecondary};
      margin-top: 6px;
    }

    .entry-description ul {
      padding-left: 18px;
      margin: 4px 0;
    }

    .entry-description li {
      margin-bottom: 3px;
    }

    /* Skills */
    .skills-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .skill-category {
      display: flex;
      align-items: flex-start;
    }

    .skill-name {
      font-weight: 600;
      color: ${colors.text};
      min-width: 140px;
      font-size: ${fontSize.body};
    }

    .skill-list {
      font-size: ${fontSize.body};
      color: ${colors.textSecondary};
    }

    /* Projects */
    .project-tech {
      font-size: ${fontSize.small};
      color: ${colors.accent};
      margin: 4px 0;
    }

    /* Print styles */
    @media print {
      body {
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .resume {
        padding: 0;
      }

      .section {
        page-break-inside: avoid;
      }

      .entry {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="resume">
    ${this.renderHeader(data, colors, options.includeLinks)}
    ${data.summary ? this.renderSummary(data.summary) : ''}
    ${data.experience.length > 0 ? this.renderExperience(data.experience) : ''}
    ${data.education.length > 0 ? this.renderEducation(data.education) : ''}
    ${data.skills.some((s) => s.skills.length > 0) ? this.renderSkills(data.skills) : ''}
    ${data.projects.length > 0 ? this.renderProjects(data.projects, options.includeLinks) : ''}
  </div>
</body>
</html>`;
  }

  /**
   * Get font sizes based on preference
   */
  private getFontSize(
    size: 'small' | 'medium' | 'large',
  ): Record<string, string> {
    const sizes = {
      small: {
        name: '22px',
        sectionTitle: '11px',
        jobTitle: '13px',
        body: '11px',
        small: '10px',
      },
      medium: {
        name: '26px',
        sectionTitle: '12px',
        jobTitle: '14px',
        body: '12px',
        small: '11px',
      },
      large: {
        name: '30px',
        sectionTitle: '13px',
        jobTitle: '15px',
        body: '13px',
        small: '12px',
      },
    };
    return sizes[size];
  }

  /**
   * Render header section
   */
  private renderHeader(
    data: ResumeBuilderData,
    _colors: TemplateColors,
    includeLinks?: boolean,
  ): string {
    const { contact } = data;
    if (!contact.fullName && !contact.email) return '';

    const contactItems: string[] = [];
    if (contact.email) {
      contactItems.push(
        `<span class="contact-item">${escapeXml(contact.email)}</span>`,
      );
    }
    if (contact.phone) {
      contactItems.push(
        `<span class="contact-item">${escapeXml(contact.phone)}</span>`,
      );
    }
    if (contact.location) {
      contactItems.push(
        `<span class="contact-item">${escapeXml(contact.location)}</span>`,
      );
    }

    const links: string[] = [];
    if (includeLinks !== false) {
      if (contact.linkedin) {
        links.push(`<a href="${escapeXml(contact.linkedin)}">LinkedIn</a>`);
      }
      if (contact.github) {
        links.push(`<a href="${escapeXml(contact.github)}">GitHub</a>`);
      }
      if (contact.website) {
        links.push(`<a href="${escapeXml(contact.website)}">Portfolio</a>`);
      }
    }

    return `
    <header class="header">
      ${contact.fullName ? `<h1 class="name">${escapeXml(contact.fullName)}</h1>` : ''}
      ${contactItems.length > 0 ? `<div class="contact-info">${contactItems.join(' | ')}</div>` : ''}
      ${links.length > 0 ? `<div class="links">${links.join(' | ')}</div>` : ''}
    </header>`;
  }

  /**
   * Render summary section
   */
  private renderSummary(summary: string): string {
    if (!summary || summary === '<p></p>') return '';

    const cleanSummary = stripHtml(summary);

    return `
    <section class="section">
      <h2 class="section-title">Professional Summary</h2>
      <p class="entry-description">${escapeXml(cleanSummary)}</p>
    </section>`;
  }

  /**
   * Render experience section
   */
  private renderExperience(experiences: ResumeExperienceEntry[]): string {
    if (experiences.length === 0) return '';

    const entries = experiences
      .map((exp) => {
        const dateRange = `${formatDate(exp.startDate)} – ${exp.current ? 'Present' : formatDate(exp.endDate)}`;
        const description = exp.description ? stripHtml(exp.description) : '';
        const descriptionHtml = description
          ? `<div class="entry-description">${this.formatDescription(description)}</div>`
          : '';

        return `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${escapeXml(exp.position || 'Position')}</div>
              <div class="entry-subtitle">${escapeXml(exp.company)}${exp.location ? ` • ${escapeXml(exp.location)}` : ''}</div>
            </div>
            <div class="entry-date">${dateRange}</div>
          </div>
          ${descriptionHtml}
        </div>`;
      })
      .join('');

    return `
    <section class="section">
      <h2 class="section-title">Experience</h2>
      ${entries}
    </section>`;
  }

  /**
   * Render education section
   */
  private renderEducation(education: ResumeEducationEntry[]): string {
    if (education.length === 0) return '';

    const entries = education
      .map((edu) => {
        const dateRange = `${formatDate(edu.startDate)} – ${formatDate(edu.endDate)}`;
        const degreeInfo = [
          edu.degree,
          edu.field ? `in ${edu.field}` : '',
          edu.gpa ? `• GPA: ${edu.gpa}` : '',
        ]
          .filter(Boolean)
          .join(' ');

        return `
        <div class="entry">
          <div class="entry-header">
            <div>
              <div class="entry-title">${escapeXml(edu.institution || 'Institution')}</div>
              <div class="entry-subtitle">${escapeXml(degreeInfo)}</div>
            </div>
            <div class="entry-date">${dateRange}</div>
          </div>
        </div>`;
      })
      .join('');

    return `
    <section class="section">
      <h2 class="section-title">Education</h2>
      ${entries}
    </section>`;
  }

  /**
   * Render skills section
   */
  private renderSkills(skills: ResumeSkillCategory[]): string {
    const filteredSkills = skills.filter((cat) => cat.skills.length > 0);
    if (filteredSkills.length === 0) return '';

    const entries = filteredSkills
      .map(
        (category) => `
        <div class="skill-category">
          <span class="skill-name">${escapeXml(category.name)}:</span>
          <span class="skill-list">${escapeXml(category.skills.join(', '))}</span>
        </div>`,
      )
      .join('');

    return `
    <section class="section">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${entries}
      </div>
    </section>`;
  }

  /**
   * Render projects section
   */
  private renderProjects(
    projects: ResumeProjectEntry[],
    includeLinks?: boolean,
  ): string {
    if (projects.length === 0) return '';

    const entries = projects
      .map((project) => {
        const linkHtml =
          includeLinks !== false && project.url
            ? ` <a href="${escapeXml(project.url)}" style="font-size: 11px;">[Link]</a>`
            : '';
        const techHtml =
          project.technologies.length > 0
            ? `<div class="project-tech">${escapeXml(project.technologies.join(' • '))}</div>`
            : '';
        const description = project.description
          ? stripHtml(project.description)
          : '';

        return `
        <div class="entry">
          <div class="entry-title">${escapeXml(project.name || 'Project')}${linkHtml}</div>
          ${techHtml}
          ${description ? `<div class="entry-description">${escapeXml(description)}</div>` : ''}
        </div>`;
      })
      .join('');

    return `
    <section class="section">
      <h2 class="section-title">Projects</h2>
      ${entries}
    </section>`;
  }

  /**
   * Format description text, converting bullet points
   */
  private formatDescription(text: string): string {
    const lines = text.split('\n').filter((line) => line.trim());

    if (lines.every((line) => line.startsWith('•') || line.startsWith('-'))) {
      // It's a bullet list
      const items = lines
        .map((line) => `<li>${escapeXml(line.replace(/^[• -]\s*/, ''))}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }

    // Regular paragraph
    return escapeXml(text);
  }
}
