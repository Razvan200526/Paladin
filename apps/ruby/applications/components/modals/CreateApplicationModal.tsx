import { Button } from '@common/components/button';
import { Input } from '@common/components/input';
import { InputName } from '@common/components/input/InputFirstName';
import { InputSalary } from '@common/components/input/InputSalary';
import { CoverLetterSelector } from '@common/components/select/CoverLetterSelector';
import { LocationSelect } from '@common/components/select/LocationSelect';
import { PlatformSelector } from '@common/components/select/PlatformSelector';
import { ResumeSelector } from '@common/components/select/ResumeSelector';
import { StatusSelector } from '@common/components/select/StatusSelector';
import { Toast } from '@common/components/toast';
import { H4, H6 } from '@common/components/typography';
import { CompanyIcon } from '@common/icons/CompanyIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { LocationIcon } from '@common/icons/LocationIcon';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCreateApplication } from '@ruby/applications/hooks/applicationHooks';
import { useCoverLetters, useResumes } from '@ruby/resources/resumes/hooks';
import { useAuth } from '@ruby/shared/hooks';
import { useState } from 'react';

interface CreateApplicationFormData {
  employer: string;
  jobTitle: string;
  jobUrl?: string;
  salary: { min: string; max: string; currency: string };
  contact?: string;
  location: string;
  platform: 'Linkedin' | 'Glassdoor' | 'Other';
  status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  resumeId?: string;
  coverletterId?: string;
}

interface CreateApplicationCardProps {
  onClose: () => void;
}

export const CreateApplicationModal = ({
  onClose,
}: CreateApplicationCardProps) => {
  const [formData, setFormData] = useState<CreateApplicationFormData>({
    employer: '',
    jobTitle: '',
    jobUrl: '',
    salary: { min: '', max: '', currency: 'USD' },
    contact: '',
    location: '',
    platform: 'Other',
    status: 'Applied',
    resumeId: undefined,
    coverletterId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createApplication } = useCreateApplication();
  const { data: user } = useAuth();
  const { data: resumes } = useResumes(user?.id || '');
  const { data: coverLetters } = useCoverLetters(user?.id || '');

  const handleInputChange = (
    field: keyof CreateApplicationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.employer || !formData.jobTitle || !formData.location) {
      return;
    }

    setIsLoading(true);
    try {
      const salaryRange =
        formData.salary.min && formData.salary.max
          ? `${formData.salary.min} - ${formData.salary.max}`
          : undefined;

      const res = await createApplication({
        userId: user?.id || '',
        data: {
          employer: formData.employer,
          jobTitle: formData.jobTitle,
          jobUrl: formData.jobUrl,
          salaryRange,
          currency: formData.salary.currency,
          contact: formData.contact,
          location: formData.location,
          platform: formData.platform,
          status: formData.status,
          resumeId: formData.resumeId,
          coverletterId: formData.coverletterId,
        },
      });
      if (!res.success || res.isForbidden || res.isUnauthorized) {
        Toast.error({
          description: 'Error creating application.Try again later',
        });
      }
      if (res.success) {
        Toast.success({ description: 'Application created successfully' });
      }
      onClose();
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };
  return (
    <div className="bg-light rounded-lg p-8 shadow-sm border border-border">
      <div className="mb-6 flex items-center justify-between">
        <H4>Create New Application</H4>
        <Button variant="light" isIconOnly onPress={handleCancel}>
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-start">
              <CompanyIcon className="size-5 text-primary" />
              <H6 className="font-semibold">Company Name</H6>
            </div>
            <InputName
              hasLabel={false}
              hasIcon={false}
              className="text-primary"
              placeholder="Enter company name"
              value={formData.employer}
              onChange={(value: string) => handleInputChange('employer', value)}
              isRequired
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center justify-start">
              <JobIcon className="size-5 text-primary" />
              <H6 className="font-semibold">Job Title</H6>
            </div>
            <InputName
              hasLabel={false}
              hasIcon={false}
              className="text-primary"
              placeholder="Enter job title"
              value={formData.jobTitle}
              onChange={(value: string) => handleInputChange('jobTitle', value)}
              isRequired
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-start gap-1">
              <LocationIcon className="size-5 text-primary" />
              <H6 className="font-semibold">Location</H6>
            </div>
            <LocationSelect
              size="sm"
              placeholder="Select location"
              onChange={(value) => handleInputChange('location', value)}
            />
          </div>

          <InputSalary
            size="sm"
            values={[formData.salary.min, formData.salary.max]}
            currency={formData.salary.currency}
            onChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                salary: value,
              }))
            }
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job URL"
            placeholder="Link to job posting"
            value={formData.jobUrl}
            onValueChange={(value) => handleInputChange('jobUrl', value)}
          />
          <Input
            label="Contact Person"
            placeholder="Recruiter or hiring manager"
            value={formData.contact}
            onValueChange={(value) => handleInputChange('contact', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <H6 className="font-semibold">Platform</H6>
            <PlatformSelector
              size="sm"
              placeholder="Where did you find this job?"
              onChange={(value) => handleInputChange('platform', value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <H6 className="font-semibold">Status</H6>
            <StatusSelector
              size="sm"
              placeholder="Current application status"
              onChange={(value) => handleInputChange('status', value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <H6 className="font-semibold">Attach Resume</H6>
            <ResumeSelector
              size="sm"
              placeholder="Select a resume"
              resumes={resumes || []}
              onChange={(value) => handleInputChange('resumeId', value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <H6 className="font-semibold">Attach Cover Letter</H6>
            <CoverLetterSelector
              size="sm"
              placeholder="Select a cover letter"
              coverLetters={coverLetters || []}
              onChange={(value) => handleInputChange('coverletterId', value)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="light" onPress={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={
            !formData.employer || !formData.jobTitle || !formData.location
          }
        >
          Create Application
        </Button>
      </div>
    </div>
  );
};
