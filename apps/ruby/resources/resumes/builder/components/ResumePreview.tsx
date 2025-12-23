import { H3, H6 } from '@common/components/typography';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import type { ResumeData } from '../types/resume-builder';

interface ResumePreviewProps {
  data: ResumeData;
}

// Helper to format date strings (e.g., "2023-06" -> "Jun 2023")
const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  if (!year || !month) return dateStr;
  const date = new Date(
    Number.parseInt(year, 10),
    Number.parseInt(month, 10) - 1,
  );
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// Helper to render HTML content safely
const HtmlContent = ({
  html,
  className,
}: {
  html: string;
  className?: string;
}) => {
  if (!html || html === '<p></p>') return null;
  return (
    <div
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Tiptap content is sanitized
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ResumePreview = ({ data }: ResumePreviewProps) => {
  const { contact, summary, experience, education, skills, projects } = data;

  const hasContact =
    contact.fullName || contact.email || contact.phone || contact.location;
  const hasSummary = summary && summary !== '<p></p>';
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasSkills =
    skills.length > 0 && skills.some((cat) => cat.skills.length > 0);
  const hasProjects = projects.length > 0;

  const isEmpty =
    !hasContact &&
    !hasSummary &&
    !hasExperience &&
    !hasEducation &&
    !hasSkills &&
    !hasProjects;

  if (isEmpty) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-background rounded border border-border">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center gap-2">
            <ResumeIcon className="size-8 text-secondary-text" />
            <H3 className="text-lg font-medium">
              Your resume preview will appear here
            </H3>
          </div>
          <div className="flex items-centre justify-center">
            <H6>Start adding content on the left panel</H6>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white mx-auto max-w-204 min-h-26 rounded border border-border ">
      {/* Resume Content */}
      <div className="p-8 space-y-6">
        {/* Header / Contact Info */}
        {hasContact && (
          <header className="text-center border-b border-gray-200 pb-4">
            {contact.fullName && (
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {contact.fullName}
              </h1>
            )}
            <div className="flex items-center justify-center gap-3 mt-2 text-sm text-gray-600 flex-wrap">
              {contact.email && (
                <span className="flex items-center gap-1">
                  <span>✉</span>
                  {contact.email}
                </span>
              )}
              {contact.phone && (
                <span className="flex items-center gap-1">
                  <span>📱</span>
                  {contact.phone}
                </span>
              )}
              {contact.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span>
                  {contact.location}
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-3 mt-1 text-sm text-blue-600 flex-wrap">
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  LinkedIn
                </a>
              )}
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  GitHub
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Portfolio
                </a>
              )}
            </div>
          </header>
        )}

        {/* Summary */}
        {hasSummary && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-2">
              Summary
            </h2>
            <HtmlContent
              html={summary || ''}
              className="text-sm text-gray-700 leading-relaxed resume-content"
            />
          </section>
        )}

        {/* Experience */}
        {hasExperience && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.position || 'Position'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={exp.description}
                    className="mt-1 text-sm text-gray-700 leading-relaxed resume-content"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {edu.institution || 'Institution'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500 whitespace-nowrap">
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={edu.description}
                    className="mt-1 text-sm text-gray-700 leading-relaxed resume-content"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {hasSkills && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Skills
            </h2>
            <div className="space-y-2">
              {skills
                .filter((cat) => cat.skills.length > 0)
                .map((category) => (
                  <div key={category.id} className="flex">
                    <span className="font-medium text-gray-900 text-sm w-40 shrink-0">
                      {category.name}:
                    </span>
                    <span className="text-sm text-gray-700">
                      {category.skills.join(', ')}
                    </span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {hasProjects && (
          <section>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-300 pb-1 mb-3">
              Projects
            </h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">
                      {project.name || 'Project'}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline"
                      >
                        [Link]
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {project.technologies.join(' • ')}
                    </p>
                  )}
                  <HtmlContent
                    html={project.description}
                    className="mt-1 text-sm text-gray-700 leading-relaxed resume-content"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Styles for resume content */}
      <style>{`
        .resume-content ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.25rem;
        }
        .resume-content ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.25rem;
        }
        .resume-content li {
          margin-bottom: 0.125rem;
        }
        .resume-content p {
          margin-bottom: 0.25rem;
        }
        .resume-content strong {
          font-weight: 600;
        }
        .resume-content em {
          font-style: italic;
        }
        .resume-content u {
          text-decoration: underline;
        }
        .resume-content a {
          color: #2563eb;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
