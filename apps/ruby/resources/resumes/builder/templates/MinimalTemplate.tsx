import type { ResumeData } from '../types/resume-builder';
import type { TemplateConfig } from '../types/templates';

interface MinimalTemplateProps {
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

export const MinimalTemplate = ({ data, config }: MinimalTemplateProps) => {
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
    color: colors.textSecondary,
    fontWeight: 400,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    marginBottom: '1rem',
  };

  const jobTitleStyle: React.CSSProperties = {
    fontSize: fonts.size.jobTitle,
    fontFamily: fonts.heading,
    color: colors.text,
    fontWeight: 500,
  };

  const bodyTextStyle: React.CSSProperties = {
    fontSize: fonts.size.body,
    fontFamily: fonts.body,
    color: colors.textSecondary,
    lineHeight: 1.7,
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
      <div className="p-10 space-y-8">
        {/* Header / Contact Info */}
        {hasContact && (
          <header className="mb-10">
            {contact.fullName && (
              <h1
                style={{
                  fontSize: fonts.size.name,
                  fontFamily: fonts.heading,
                  color: colors.text,
                  fontWeight: 400,
                  letterSpacing: '0.02em',
                  marginBottom: '0.75rem',
                }}
              >
                {contact.fullName}
              </h1>
            )}
            <div
              className="flex items-center gap-4 flex-wrap"
              style={smallTextStyle}
            >
              {contact.email && <span>{contact.email}</span>}
              {contact.email && (contact.phone || contact.location) && (
                <span style={{ color: colors.sectionBorder }}>|</span>
              )}
              {contact.phone && <span>{contact.phone}</span>}
              {contact.phone && contact.location && (
                <span style={{ color: colors.sectionBorder }}>|</span>
              )}
              {contact.location && <span>{contact.location}</span>}
            </div>
            <div
              className="flex items-center gap-4 mt-2 flex-wrap"
              style={smallTextStyle}
            >
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  linkedin.com
                </a>
              )}
              {contact.github && (
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  github.com
                </a>
              )}
              {contact.website && (
                <a
                  href={contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  portfolio
                </a>
              )}
            </div>
          </header>
        )}

        {/* Summary */}
        {hasSummary && (
          <section>
            <h2 style={sectionTitleStyle}>About</h2>
            <HtmlContent
              html={summary || ''}
              className="resume-content max-w-2xl"
              style={bodyTextStyle}
            />
          </section>
        )}

        {/* Experience */}
        {hasExperience && (
          <section>
            <h2 style={sectionTitleStyle}>Experience</h2>
            <div className="space-y-6">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 style={jobTitleStyle}>{exp.position || 'Position'}</h3>
                    <span style={smallTextStyle}>
                      {formatDate(exp.startDate)} —{' '}
                      {exp.current ? 'Present' : formatDate(exp.endDate)}
                    </span>
                  </div>
                  <p
                    style={{
                      ...smallTextStyle,
                      marginBottom: '0.5rem',
                    }}
                  >
                    {exp.company}
                    {exp.location && `, ${exp.location}`}
                  </p>
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
            <div className="space-y-5">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 style={jobTitleStyle}>
                      {edu.institution || 'Institution'}
                    </h3>
                    <span style={smallTextStyle}>
                      {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
                    </span>
                  </div>
                  <p style={smallTextStyle}>
                    {edu.degree}
                    {edu.field && ` in ${edu.field}`}
                    {edu.gpa && ` · ${edu.gpa} GPA`}
                  </p>
                  <HtmlContent
                    html={edu.description}
                    className="resume-content mt-2"
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
                        fontWeight: 500,
                        color: colors.text,
                      }}
                    >
                      {category.name}
                    </span>
                    <span style={bodyTextStyle}>
                      {' · '}
                      {category.skills.join(' · ')}
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
            <div className="space-y-5">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <h3 style={jobTitleStyle}>{project.name || 'Project'}</h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          ...smallTextStyle,
                          textDecoration: 'underline',
                        }}
                      >
                        link
                      </a>
                    )}
                  </div>
                  {project.technologies.length > 0 && (
                    <p
                      style={{
                        ...smallTextStyle,
                        marginBottom: '0.375rem',
                      }}
                    >
                      {project.technologies.join(' · ')}
                    </p>
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
          list-style-type: none;
          padding-left: 0;
          margin-top: 0.5rem;
        }
        .resume-content ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin-top: 0.5rem;
        }
        .resume-content li {
          margin-bottom: 0.25rem;
          position: relative;
          padding-left: 1rem;
        }
        .resume-content li::before {
          content: "–";
          position: absolute;
          left: 0;
          color: ${colors.textSecondary};
        }
        .resume-content p {
          margin-bottom: 0.25rem;
        }
        .resume-content strong {
          font-weight: 500;
        }
        .resume-content em {
          font-style: italic;
        }
        .resume-content u {
          text-decoration: underline;
        }
        .resume-content a {
          color: ${colors.text};
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};
