import { InputName } from '@common/components/input/InputFirstName';
import type { InputTextRefType } from '@common/components/input/InputText';
import { Toast } from '@common/components/toast';
import { EducationIcon } from '@common/icons/EducationIcon';
import { ExperienceIcon } from '@common/icons/ExperienceIcon';
import { ProjectsIcon } from '@common/icons/ProjectsIcon';
import { ResumeIcon } from '@common/icons/ResumeIcon';
import { SkillsIcon } from '@common/icons/SkillsIcon';
import { SummaryIcon } from '@common/icons/SummaryIcon';
import { Button } from '@heroui/button';
import { Spinner } from '@heroui/react';
import {
  ContactIcon,
  DownloadIcon,
  LayoutTemplateIcon,
  SaveIcon,
} from 'lucide-react';
import { nanoid } from 'nanoid';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import {
  ContactSection,
  EducationSection,
  ProjectsSection,
  ResumePreview,
  SkillsSection,
  SummarySection,
  TemplateSelector,
} from './components';
import { ExperienceSection } from './components/ExperienceSection';
import { useResumeBuilder } from './hooks/useResumeBuilder';
import type { ResumeData } from './types/resume-builder';
import type { TemplateId } from './types/templates';

const sections = [
  {
    label: 'Template',
    value: 'template',
    icon: <LayoutTemplateIcon className="size-3.5 text-secondary-text" />,
  },
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

const createInitialResumeData = (): ResumeData => ({
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
});

export const ResumeBuilderPage = () => {
  const { id: resumeIdFromUrl } = useParams<{ id: string }>();
  const [resumeData, setResumeData] = useState<ResumeData>(
    createInitialResumeData(),
  );
  const [activeSection, setActiveSection] = useState<string>('template');
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateId>('modern');
  const [savedResumeId, setSavedResumeId] = useState<string | null>(
    resumeIdFromUrl || null,
  );
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const nameRef = useRef<InputTextRefType | null>(null);

  const {
    resumeBuilder,
    isLoading,
    createResume,
    saveResume,
    downloadPDFFromData,
    isSaving,
    lastSaved,
  } = useResumeBuilder({ resumeId: resumeIdFromUrl });

  useEffect(() => {
    if (resumeIdFromUrl && resumeBuilder && !isInitialized) {
      const loadedData: ResumeData = {
        id: resumeBuilder.id,
        name: resumeBuilder.name,
        templateId: resumeBuilder.templateId as TemplateId,
        contact: resumeBuilder.data.contact,
        summary: resumeBuilder.data.summary || '',
        experience: resumeBuilder.data.experience || [],
        education: resumeBuilder.data.education || [],
        skills: resumeBuilder.data.skills || [],
        projects: resumeBuilder.data.projects || [],
        customSections: resumeBuilder.data.customSections || [],
        createdAt: new Date(resumeBuilder.createdAt),
        updatedAt: new Date(resumeBuilder.updatedAt),
      };

      setResumeData(loadedData);
      setSelectedTemplate(resumeBuilder.templateId as TemplateId);
      setSavedResumeId(resumeBuilder.id);

      if (nameRef.current) {
        nameRef.current.setValue(resumeBuilder.name);
      }

      setIsInitialized(true);
    } else if (!resumeIdFromUrl && !isInitialized) {
      setIsInitialized(true);
    }
  }, [resumeIdFromUrl, resumeBuilder, isInitialized]);

  const updateResumeData = <K extends keyof ResumeData>(
    key: K,
    value: ResumeData[K],
  ) => {
    setResumeData((prev) => ({
      ...prev,
      [key]: value,
      updatedAt: new Date(),
    }));
    setHasUnsavedChanges(true);
  };

  const handleTemplateSelect = (templateId: TemplateId) => {
    setSelectedTemplate(templateId);
    updateResumeData('templateId', templateId);
  };

  const currentJobTitle =
    resumeData.experience.length > 0
      ? resumeData.experience[0].position
      : undefined;

  const calculateYearsOfExperience = (): number => {
    if (resumeData.experience.length === 0) return 0;

    let totalMonths = 0;
    for (const exp of resumeData.experience) {
      if (exp.startDate) {
        const start = new Date(exp.startDate);
        const end = exp.current
          ? new Date()
          : exp.endDate
            ? new Date(exp.endDate)
            : new Date();
        const months =
          (end.getFullYear() - start.getFullYear()) * 12 +
          (end.getMonth() - start.getMonth());
        totalMonths += months;
      }
    }
    return Math.round(totalMonths / 12);
  };

  const allSkills = resumeData.skills.flatMap((cat) => cat.skills);

  const getBuilderData = useCallback(() => {
    return {
      contact: resumeData.contact,
      summary: resumeData.summary,
      experience: resumeData.experience,
      education: resumeData.education,
      skills: resumeData.skills,
      projects: resumeData.projects,
      customSections: resumeData.customSections,
    };
  }, [resumeData]);

  const handleSave = useCallback(async () => {
    const builderData = getBuilderData();

    try {
      if (savedResumeId) {
        await saveResume(savedResumeId, {
          name: resumeData.name,
          templateId: selectedTemplate,
          data: builderData,
        });
        Toast.success({ description: 'Resume saved successfully' });
      } else {
        const result = await createResume(
          resumeData.name,
          builderData,
          selectedTemplate,
        );
        if (result?.id) {
          setSavedResumeId(result.id);
          Toast.success({ description: 'Resume created successfully' });
        }
      }
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save error:', error);
    }
  }, [
    savedResumeId,
    resumeData.name,
    selectedTemplate,
    getBuilderData,
    saveResume,
    createResume,
  ]);

  const handleDownloadPDF = useCallback(async () => {
    const builderData = getBuilderData();

    await downloadPDFFromData(
      builderData,
      selectedTemplate,
      resumeData.name || 'Resume',
      {
        includeLinks: true,
        fontSize: 'medium',
      },
    );
  }, [getBuilderData, selectedTemplate, resumeData.name, downloadPDFFromData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const formatLastSaved = () => {
    if (!lastSaved) return null;
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Saved just now';
    if (minutes === 1) return 'Saved 1 minute ago';
    if (minutes < 60) return `Saved ${minutes} minutes ago`;

    return `Saved at ${lastSaved.toLocaleTimeString()}`;
  };

  if (resumeIdFromUrl && isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-secondary-text">Loading resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Action Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <InputName
            label=""
            hasLabel={false}
            icon={<ResumeIcon className="text-secondary-text" />}
            value={nameRef.current?.getValue()}
            onChange={(e) => {
              nameRef.current?.setValue(e);
              updateResumeData('name', e);
            }}
            placeholder="Resume Name"
            ref={nameRef}
            className="w-64"
          />
          {lastSaved && (
            <span className="text-xs text-secondary-text">
              {formatLastSaved()}
            </span>
          )}
          {hasUnsavedChanges && !isSaving && (
            <span className="text-xs text-warning-500">• Unsaved changes</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="flat"
            color="primary"
            size="sm"
            startContent={<SaveIcon className="size-4" />}
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={isSaving}
          >
            {savedResumeId ? 'Save' : 'Save Resume'}
          </Button>
          <Button
            type="button"
            variant="solid"
            color="primary"
            size="sm"
            startContent={<DownloadIcon className="size-4" />}
            onPress={handleDownloadPDF}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Editor */}
        <div className="w-1/2 overflow-y-auto p-6 border-r border-border">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Section Navigation */}
            <div className="flex gap-2 flex-wrap">
              {sections.map((section) => (
                <Button
                  type="button"
                  key={section.value}
                  onPress={() => setActiveSection(section.value)}
                  variant={activeSection === section.value ? 'solid' : 'light'}
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
            {activeSection === 'template' && (
              <TemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateSelect}
              />
            )}
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
                jobTitle={currentJobTitle}
                yearsOfExperience={calculateYearsOfExperience()}
                skills={allSkills}
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

        {/* Right Panel - Preview */}
        <div className="w-1/2 bg-background overflow-y-auto p-6">
          <ResumePreview data={resumeData} templateId={selectedTemplate} />
        </div>
      </div>
    </div>
  );
};
