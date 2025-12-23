import { Button } from '@common/components/button';
import { Input } from '@common/components/input';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { Toast } from '@common/components/toast';
import { H4 } from '@common/components/typography';
import { PlusIcon } from '@heroicons/react/24/outline';
import { Select, SelectItem } from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import { useCreateApplication } from '../hooks/applicationHooks';

export type CreateApplicationFormData = {
  employer: string;
  jobTitle: string;
  jobUrl?: string;
  salaryRange?: string;
  currency: string;
  contact?: string;
  location: string;
  platform: 'Linkedin' | 'Glassdoor' | 'Other';
  status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  resumeId?: string;
  coverletterId?: string;
};

export const CreateApplicationButton = () => {
  const createModalRef = useRef<ModalRefType>(null);
  const [formData, setFormData] = useState<CreateApplicationFormData>({
    employer: '',
    jobTitle: '',
    jobUrl: '',
    salaryRange: '',
    currency: 'EUR',
    contact: '',
    location: '',
    platform: 'Other',
    status: 'Applied',
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: user } = useAuth();
  const { mutateAsync: createApp } = useCreateApplication();
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
      const res = await createApp({
        data: formData,
        userId: user?.id || '',
      });

      if (!res.success) {
        Toast.error({ description: 'Failed to create application' });
      }
      if (res.success) {
        Toast.success({ description: 'Application created succesfully' });
      }

      setFormData({
        employer: '',
        jobTitle: '',
        jobUrl: '',
        salaryRange: '',
        currency: 'EUR',
        contact: '',
        location: '',
        platform: 'Other',
        status: 'Applied',
      });
      createModalRef.current?.close();
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        color="primary"
        size="sm"
        startContent={<PlusIcon className="size-3.5" />}
        onPress={() => createModalRef.current?.open()}
      >
        Create Application
      </Button>

      <Modal
        size="2xl"
        className="bg-light rounded"
        modalRef={createModalRef}
        hideCloseButton={false}
      >
        <div className="p-6">
          <H4 className="mb-6">Create New Application</H4>

          <div className="grid gap-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Company Name"
                placeholder="Enter company name"
                value={formData.employer}
                onValueChange={(value: any) =>
                  handleInputChange('employer', value)
                }
                isRequired
              />
              <Input
                label="Job Title"
                placeholder="Enter job title"
                value={formData.jobTitle}
                onValueChange={(value: any) =>
                  handleInputChange('jobTitle', value)
                }
                isRequired
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Location"
                placeholder="Enter job location"
                value={formData.location}
                onValueChange={(value: any) =>
                  handleInputChange('location', value)
                }
                isRequired
              />
              <Input
                label="Salary Range"
                placeholder="e.g. $80,000 - $100,000"
                value={formData.salaryRange}
                onValueChange={(value: any) =>
                  handleInputChange('salaryRange', value)
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Job URL"
                placeholder="Link to job posting"
                value={formData.jobUrl}
                onValueChange={(value: any) =>
                  handleInputChange('jobUrl', value)
                }
              />
              <Input
                label="Contact Person"
                placeholder="Recruiter or hiring manager"
                value={formData.contact}
                onValueChange={(value: any) =>
                  handleInputChange('contact', value)
                }
              />
            </div>

            {/* Platform and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Platform"
                placeholder="Where did you find this job?"
                selectedKeys={[formData.platform]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange('platform', value);
                }}
              >
                <SelectItem key="linkedin">LinkedIn</SelectItem>
                <SelectItem key="glassdoor">Glassdoor</SelectItem>
                <SelectItem key="other">Other</SelectItem>
              </Select>

              <Select
                label="Status"
                placeholder="Current application status"
                selectedKeys={[formData.status]}
                onSelectionChange={(keys) => {
                  const value = Array.from(keys)[0] as string;
                  handleInputChange('status', value);
                }}
              >
                <SelectItem key="applied">Applied</SelectItem>
                <SelectItem key="interviewing">Interviewing</SelectItem>
                <SelectItem key="accepted">Accepted</SelectItem>
                <SelectItem key="rejected">Rejected</SelectItem>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="light"
              onPress={() => createModalRef.current?.close()}
            >
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
      </Modal>
    </>
  );
};
