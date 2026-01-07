import type { ResumeData } from '../types/resume-builder';
import type { TemplateConfig } from '../types/templates';

interface ModernTemplateProps {
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

export const ModernTemplate = ({ data, config }: ModernTemplateProps) => {
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
    color: colors.accent,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    paddingLeft: '0.75rem',
    borderLeft: `3px solid ${colors.accent}`,
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
    lineHeight: 1.6,
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
      {/* Header Section with subtle background */}
      {hasContact && (
        <header
          className="px-8 py-6"
          style={{ backgroundColor: colors.headerBackground }}
        >
          {contact.fullName && (
            <h1
              style={{
                fontSize: fonts.size.name,
                fontFamily: fonts.heading,
                color: colors.text,
                fontWeight: 700,
                letterSpacing: '-0.02em',
                marginBottom: '0.5rem',
              }}
            >
              {contact.fullName}
            </h1>
          )}
          <div
            className="flex items-center gap-4 flex-wrap"
            style={smallTextStyle}
          >
            {contact.email && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke={colors.accent}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                {contact.email}
              </span>
            )}
            {contact.phone && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke={colors.accent}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {contact.phone}
              </span>
            )}
            {contact.location && (
              <span className="flex items-center gap-1.5">
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke={colors.accent}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {contact.location}
              </span>
            )}
          </div>
          <div
            className="flex items-center gap-4 mt-2 flex-wrap"
            style={{ ...smallTextStyle, color: colors.accent }}
          >
            {contact.linkedin && (
              <a
                href={contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <svg
                  className="size-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </a>
            )}
            {contact.github && (
              <a
                href={contact.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <svg
                  className="size-3.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            )}
            {contact.website && (
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline flex items-center gap-1"
              >
                <svg
                  className="size-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                Portfolio
              </a>
            )}
          </div>
        </header>
      )}

      {/* Resume Content */}
      <div className="px-8 py-6 space-y-6">
        {/* Summary */}
        {hasSummary && (
          <section>
            <h2 style={sectionTitleStyle}>Profile</h2>
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
                          color: colors.accent,
                          fontWeight: 500,
                        }}
                      >
                        {exp.company}
                        {exp.location && (
                          <span style={{ color: colors.textSecondary }}>
                            {' '}
                            • {exp.location}
                          </span>
                        )}
                      </p>
                    </div>
                    <p
                      style={{
                        ...smallTextStyle,
                        whiteSpace: 'nowrap',
                        backgroundColor: colors.headerBackground,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                      }}
                    >
                      {formatDate(exp.startDate)} –{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={exp.description}
                    className="resume-content"
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
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 style={jobTitleStyle}>
                        {edu.institution || 'Institution'}
                      </h3>
                      <p style={smallTextStyle}>
                        <span style={{ color: colors.accent, fontWeight: 500 }}>
                          {edu.degree}
                        </span>
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && (
                          <span
                            style={{
                              marginLeft: '0.5rem',
                              padding: '0.125rem 0.375rem',
                              backgroundColor: colors.headerBackground,
                              borderRadius: '0.25rem',
                            }}
                          >
                            GPA: {edu.gpa}
                          </span>
                        )}
                      </p>
                    </div>
                    <p style={{ ...smallTextStyle, whiteSpace: 'nowrap' }}>
                      {formatDate(edu.startDate)} – {formatDate(edu.endDate)}
                    </p>
                  </div>
                  <HtmlContent
                    html={edu.description}
                    className="resume-content"
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
            <div className="space-y-3">
              {skills
                .filter((cat) => cat.skills.length > 0)
                .map((category) => (
                  <div key={category.id}>
                    <span
                      style={{
                        ...smallTextStyle,
                        color: colors.accent,
                        fontWeight: 600,
                        display: 'block',
                        marginBottom: '0.25rem',
                      }}
                    >
                      {category.name}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {category.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: fonts.size.small,
                            backgroundColor: colors.headerBackground,
                            color: colors.text,
                            padding: '0.25rem 0.625rem',
                            borderRadius: '0.375rem',
                            border: `1px solid ${colors.sectionBorder}`,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {hasProjects && (
          <section>
            <h2 style={sectionTitleStyle}>Projects</h2>
            <div className="space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: colors.headerBackground,
                    borderRadius: '0.5rem',
                    border: `1px solid ${colors.sectionBorder}`,
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
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
                        ↗ View
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.625rem',
                            color: colors.accent,
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            border: `1px solid ${colors.accent}`,
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  <HtmlContent
                    html={project.description}
                    className="resume-content"
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
          margin-bottom: 0.25rem;
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
