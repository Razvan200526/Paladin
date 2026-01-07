import type { ResumeData } from '../types/resume-builder';
import type { TemplateConfig } from '../types/templates';

interface ProfessionalTemplateProps {
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

export const ProfessionalTemplate = ({
  data,
  config,
}: ProfessionalTemplateProps) => {
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

  const sidebarSectionTitleStyle: React.CSSProperties = {
    fontSize: fonts.size.sectionTitle,
    fontFamily: fonts.heading,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '0.75rem',
    paddingBottom: '0.375rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const mainSectionTitleStyle: React.CSSProperties = {
    fontSize: fonts.size.sectionTitle,
    fontFamily: fonts.heading,
    color: colors.primary,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: '0.75rem',
    paddingBottom: '0.375rem',
    borderBottom: `2px solid ${colors.primary}`,
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

  const sidebarTextStyle: React.CSSProperties = {
    fontSize: fonts.size.small,
    fontFamily: fonts.body,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 1.5,
  };

  return (
    <div
      className="flex min-h-full"
      style={{
        backgroundColor: colors.background,
        fontFamily: fonts.body,
      }}
    >
      {/* Left Sidebar */}
      <div
        className="w-1/3 p-6"
        style={{
          backgroundColor: colors.headerBackground,
          color: 'white',
        }}
      >
        {/* Name in sidebar header */}
        {hasContact && (
          <div className="mb-8">
            {contact.fullName && (
              <h1
                style={{
                  fontSize: fonts.size.name,
                  fontFamily: fonts.heading,
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  marginBottom: '1rem',
                }}
              >
                {contact.fullName}
              </h1>
            )}

            {/* Contact Details */}
            <div className="space-y-2" style={sidebarTextStyle}>
              {contact.email && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="break-all">{contact.email}</span>
                </div>
              )}
              {contact.phone && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{contact.phone}</span>
                </div>
              )}
              {contact.location && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{contact.location}</span>
                </div>
              )}
              {contact.linkedin && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                  <a
                    href={contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline break-all"
                  >
                    LinkedIn
                  </a>
                </div>
              )}
              {contact.github && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  <a
                    href={contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    GitHub
                  </a>
                </div>
              )}
              {contact.website && (
                <div className="flex items-center gap-2">
                  <svg
                    className="size-4 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                    />
                  </svg>
                  <a
                    href={contact.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Portfolio
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills in Sidebar */}
        {hasSkills && (
          <div className="mb-8">
            <h2 style={sidebarSectionTitleStyle}>Skills</h2>
            <div className="space-y-4">
              {skills
                .filter((cat) => cat.skills.length > 0)
                .map((category) => (
                  <div key={category.id}>
                    <h3
                      style={{
                        ...sidebarTextStyle,
                        fontWeight: 600,
                        marginBottom: '0.375rem',
                      }}
                    >
                      {category.name}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.6875rem',
                            backgroundColor: 'rgba(255, 255, 255, 0.15)',
                            color: 'white',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {hasEducation && (
          <div>
            <h2 style={sidebarSectionTitleStyle}>Education</h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <h3
                    style={{
                      ...sidebarTextStyle,
                      fontWeight: 600,
                      color: 'white',
                    }}
                  >
                    {edu.institution || 'Institution'}
                  </h3>
                  <p style={{ ...sidebarTextStyle, opacity: 0.9 }}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                  </p>
                  <p
                    style={{
                      ...sidebarTextStyle,
                      opacity: 0.7,
                      fontSize: '0.6875rem',
                    }}
                  >
                    {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    {edu.gpa && ` • GPA: ${edu.gpa}`}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="w-2/3 p-6" style={{ color: colors.text }}>
        {/* Summary */}
        {hasSummary && (
          <section className="mb-6">
            <h2 style={mainSectionTitleStyle}>Professional Summary</h2>
            <HtmlContent
              html={summary || ''}
              className="resume-content-pro"
              style={bodyTextStyle}
            />
          </section>
        )}

        {/* Experience */}
        {hasExperience && (
          <section className="mb-6">
            <h2 style={mainSectionTitleStyle}>Professional Experience</h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 style={jobTitleStyle}>
                        {exp.position || 'Position'}
                      </h3>
                      <p
                        style={{
                          ...smallTextStyle,
                          color: colors.primary,
                          fontWeight: 500,
                        }}
                      >
                        {exp.company}
                        {exp.location && (
                          <span style={{ color: colors.textSecondary }}>
                            {' '}
                            | {exp.location}
                          </span>
                        )}
                      </p>
                    </div>
                    <p
                      style={{
                        ...smallTextStyle,
                        whiteSpace: 'nowrap',
                        fontWeight: 500,
                      }}
                    >
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={exp.description}
                    className="resume-content-pro mt-2"
                    style={bodyTextStyle}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {hasProjects && (
          <section>
            <h2 style={mainSectionTitleStyle}>Key Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 style={jobTitleStyle}>{project.name || 'Project'}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: fonts.size.small,
                          color: colors.primary,
                        }}
                        className="hover:underline"
                      >
                        ↗
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <p
                      style={{
                        ...smallTextStyle,
                        color: colors.primary,
                        marginBottom: '0.375rem',
                      }}
                    >
                      {project.technologies.join(' • ')}
                    </p>
                  )}
                  <HtmlContent
                    html={project.description}
                    className="resume-content-pro"
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
        .resume-content-pro ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin-top: 0.25rem;
        }
        .resume-content-pro ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.25rem;
        }
        .resume-content-pro li {
          margin-bottom: 0.25rem;
        }
        .resume-content-pro p {
          margin-bottom: 0.25rem;
        }
        .resume-content-pro strong {
          font-weight: 600;
        }
        .resume-content-pro em {
          font-style: italic;
        }
        .resume-content-pro u {
          text-decoration: underline;
        }
        .resume-content-pro a {
          color: ${colors.primary};
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
