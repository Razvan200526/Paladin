import type { ResumeData } from '../types/resume-builder';
import type { TemplateConfig } from '../types/templates';

interface ClassicTemplateProps {
  data: ResumeData;
  config: TemplateConfig;
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
  style,
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}) => {
  if (!html || html === '<p></p>') return null;
  return (
    <div
      className={className}
      style={style}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Tiptap content is sanitized
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export const ClassicTemplate = ({ data, config }: ClassicTemplateProps) => {
  const { contact, summary, experience, education, skills, projects } = data;
  const { colors, fonts } = config;

  const hasContact =
    contact.fullName || contact.email || contact.phone || contact.location;
  const hasSummary = summary && summary !== '<p></p>';
  const hasExperience = experience.length > 0;
  const hasEducation = education.length > 0;
  const hasSkills =
    skills.length > 0 && skills.some((cat) => cat.skills.length > 0);
  const hasProjects = projects.length > 0;

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: fonts.size.sectionTitle,
    fontFamily: fonts.heading,
    color: colors.primary,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `1px solid ${colors.sectionBorder}`,
    paddingBottom: '0.25rem',
    marginBottom: '0.75rem',
  };

  const jobTitleStyle: React.CSSProperties = {
    fontSize: fonts.size.jobTitle,
    fontFamily: fonts.heading,
    color: colors.text,
    fontWeight: 600,
  };

  const bodyTextStyle: React.CSSProperties = {
    fontSize: fonts.size.body,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    lineHeight: 1.5,
  };

  const smallTextStyle: React.CSSProperties = {
    fontSize: fonts.size.small,
    fontFamily: fonts.body,
    color: colors.textSecondary,
  };

  return (
    <div
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
        color: colors.text,
      }}
    >
      {/* Resume Content */}
      <div className="p-8 space-y-6">
        {/* Header / Contact Info */}
        {hasContact && (
          <header
            className="text-center pb-4"
            style={{ borderBottom: `1px solid ${colors.sectionBorder}` }}
          >
            {contact.fullName && (
              <h1
                style={{
                  fontSize: fonts.size.name,
                  fontFamily: fonts.heading,
                  color: colors.text,
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                }}
              >
                {contact.fullName}
              </h1>
            )}
            <div
              className="flex items-center justify-center gap-3 mt-2 flex-wrap"
              style={smallTextStyle}
            >
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
            <div
              className="flex items-center justify-center gap-3 mt-1 flex-wrap"
              style={{ ...smallTextStyle, color: colors.accent }}
            >
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
            <h2 style={sectionTitleStyle}>Summary</h2>
            <HtmlContent
              html={summary || ''}
              className="resume-content"
              style={bodyTextStyle}
            />
          </section>
        )}

        {/* Experience */}
        {hasExperience && (
          <section>
            <h2 style={sectionTitleStyle}>Experience</h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={jobTitleStyle}>
                        {exp.position || 'Position'}
                      </h3>
                      <p style={smallTextStyle}>
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                    </div>
                    <p style={{ ...smallTextStyle, whiteSpace: 'nowrap' }}>
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={exp.description}
                    className="mt-1 resume-content"
                    style={bodyTextStyle}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {hasEducation && (
          <section>
            <h2 style={sectionTitleStyle}>Education</h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={jobTitleStyle}>
                        {edu.institution || 'Institution'}
                      </h3>
                      <p style={smallTextStyle}>
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p style={{ ...smallTextStyle, whiteSpace: 'nowrap' }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={edu.description}
                    className="mt-1 resume-content"
                    style={bodyTextStyle}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {hasSkills && (
          <section>
            <h2 style={sectionTitleStyle}>Skills</h2>
            <div className="space-y-2">
              {skills
                .filter((cat) => cat.skills.length > 0)
                .map((category) => (
                  <div key={category.id} className="flex">
                    <span
                      style={{
                        ...bodyTextStyle,
                        color: colors.text,
                        fontWeight: 500,
                        width: '10rem',
                        flexShrink: 0,
                      }}
                    >
                      {category.name}:
                    </span>
                    <span style={bodyTextStyle}>
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
            <h2 style={sectionTitleStyle}>Projects</h2>
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2">
                    <h3 style={jobTitleStyle}>{project.name || 'Project'}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: fonts.size.small,
                          color: colors.accent,
                        }}
                        className="hover:underline"
                      >
                        [Link]
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <p style={{ ...smallTextStyle, marginTop: '0.125rem' }}>
                      {project.technologies.join(' • ')}
                    </p>
                  )}
                  <HtmlContent
                    html={project.description}
                    className="mt-1 resume-content"
                    style={bodyTextStyle}
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
          color: ${colors.accent};
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
