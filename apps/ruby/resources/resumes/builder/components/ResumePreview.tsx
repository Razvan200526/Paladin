import { H3, H6 } from '@common/components/typography';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import {
  ClassicTemplate,
  CreativeTemplate,
  MinimalTemplate,
  ModernTemplate,
  ProfessionalTemplate,
} from '../templates';
import type { ResumeData } from '../types/resume-builder';
import { getTemplate, type TemplateId } from '../types/templates';

interface ResumePreviewProps {
  data: ResumeData;
  templateId?: TemplateId;
}

export const ResumePreview = ({
  data,
  templateId = 'classic',
}: ResumePreviewProps) => {
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

  const config = getTemplate(templateId);

  // Render the appropriate template based on templateId
  const renderTemplate = () => {
    switch (templateId) {
      case 'modern':
        return <ModernTemplate data={data} config={config} />;
      case 'minimal':
        return <MinimalTemplate data={data} config={config} />;
      case 'professional':
        return <ProfessionalTemplate data={data} config={config} />;
      case 'creative':
        return <CreativeTemplate data={data} config={config} />;
      default:
        return <ClassicTemplate data={data} config={config} />;
    }
  };

  return (
    <div className="bg-white mx-auto max-w-204 min-h-26 rounded border border-border overflow-hidden">
      {renderTemplate()}
    </div>
  );
};
