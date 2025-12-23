import { InputName } from '@common/components/input/InputFirstName';
import type { InputTextRefType } from '@common/components/input/InputText';
import { EducationIcon } from '@common/icons/EducationIcon';
import { ExperienceIcon } from '@common/icons/ExperienceIcon';
import { ProjectsIcon } from '@common/icons/ProjectsIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { SkillsIcon } from '@common/icons/SkillsIcon';
import { SummaryIcon } from '@common/icons/SummaryIcon';
import { Button } from '@heroui/button';
import { ContactIcon } from 'lucide-react';
import { nanoid } from 'nanoid';
import { useRef, useState } from 'react';
import {
  ContactSection,
  EducationSection,
  ProjectsSection,
  ResumePreview,
  SkillsSection,
  SummarySection,
} from './components';
import { ExperienceSection } from './components/ExperienceSection';
import type { ResumeData } from './types/resume-builder';

const sections = [
  {
    label: 'Contact',
    value: 'contact',
    icon: <ContactIcon className="size-3.5 text-secondary-text" />,
  },
  {
    label: 'Summary',
    value: 'summary',
    icon: <SummaryIcon className="size-3.5 text-secondary-text" />,
  },
  {
    label: 'Experience',
    value: 'experience',
    icon: <ExperienceIcon className="size-3.5 text-secondary-text" />,
  },
  {
    label: 'Education',
    value: 'education',
    icon: <EducationIcon className="size-3.5 text-secondary-text" />,
  },
  {
    label: 'Skills',
    value: 'skills',
    icon: <SkillsIcon className="size-3.5 text-secondary-text" />,
  },
  {
    label: 'Projects',
    value: 'projects',
    icon: <ProjectsIcon className="size-3.5 text-secondary-text" />,
  },
];
const initialResumeData: ResumeData = {
  id: nanoid(15),
  name: 'Untitled Resume',
  templateId: 'classic',
  contact: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  customSections: [],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const ResumeBuilderPage = () => {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [activeSection, setActiveSection] = useState<string>('contact');
  const nameRef = useRef<InputTextRefType | null>(null);
  const updateResumeData = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K],
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [key]: value,
      updatedAt: new Date(),
    }));
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Editor */}
      <div className="w-1/2 overflow-y-auto p-6 border-r border-border">
        <div className="max-w-2xl mx-auto space-y-6">
          <InputName
            label="Resume Name"
            icon={<ResumeIcon className="text-secondary-text" />}
            value={nameRef.current?.getValue()}
            onChange={(e) => {
              nameRef.current?.setValue(e);
              updateResumeData('name', e);
            }}
            placeholder="Resume Name"
            ref={nameRef}
          />

          {/* Section Navigation */}
          <div className="flex gap-2 flex-wrap">
            {sections.map((section) => (
              <Button
                type="button"
                key={section.value}
                onPress={() => setActiveSection(section.value)}
                variant="light"
                color="primary"
                radius="sm"
                size="sm"
                startContent={section.icon}
              >
                {section.label}
              </Button>
            ))}
          </div>

          {/* Active Section */}
          {activeSection === 'contact' && (
            <ContactSection
              contact={resumeData.contact}
              onChange={(v) => updateResumeData('contact', v)}
            />
          )}
          {activeSection === 'summary' && (
            <SummarySection
              summary={resumeData.summary}
              onChange={(v) => updateResumeData('summary', v)}
            />
          )}
          {activeSection === 'experience' && (
            <ExperienceSection
              entries={resumeData.experience}
              onChange={(v) => updateResumeData('experience', v)}
            />
          )}
          {activeSection === 'education' && (
            <EducationSection
              entries={resumeData.education}
              onChange={(v) => updateResumeData('education', v)}
            />
          )}
          {activeSection === 'skills' && (
            <SkillsSection
              categories={resumeData.skills}
              onChange={(v) => updateResumeData('skills', v)}
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsSection
              entries={resumeData.projects}
              onChange={(v) => updateResumeData('projects', v)}
            />
          )}
        </div>
      </div>

      <div className="w-1/2 bg-background overflow-y-auto p-6">
        <ResumePreview data={resumeData} />
      </div>
    </div>
  );
};
