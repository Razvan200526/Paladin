import { Button } from '@common/components/button';
import { Input } from '@common/components/input';
import { InputName } from '@common/components/input/InputFirstName';
import { InputSalary } from '@common/components/input/InputSalary';
import { Modal, type ModalRefType } from '@common/components/Modal';
import { LocationSelect } from '@common/components/select/LocationSelect';
import { PlatformSelector } from '@common/components/select/PlatformSelector';
import { StatusSelector } from '@common/components/select/StatusSelector';
import { Toast } from '@common/components/toast';
import { H4, H6 } from '@common/components/typography';
import { CompanyIcon } from '@common/icons/CompanyIcon';
import { JobIcon } from '@common/icons/JobIcon';
import { LocationIcon } from '@common/icons/LocationIcon';
import { useAuth } from '@ruby/shared/hooks';
import type { ApplicationType } from '@sdk/types';
import { useEffect, useState } from 'react';
import { useUpdateApplication } from '../../hooks/applicationHooks';

interface EditApplicationModalProps {
  modalRef: React.RefObject<ModalRefType | null>;
  application: ApplicationType;
  onSuccess?: () => void;
}

const parseSalaryRange = (
  salaryRange: string | undefined,
  currency: string | undefined,
) => {
  if (!salaryRange) return { min: '', max: '', currency: currency || 'USD' };
  const parts = salaryRange.split(' - ');
  if (parts.length === 2) {
    return { min: parts[0], max: parts[1], currency: currency || 'USD' };
  }
  return { min: '', max: '', currency: currency || 'USD' };
};

export const EditApplicationModal = ({
  modalRef,
  application,
  onSuccess,
}: EditApplicationModalProps) => {
  const { data: user } = useAuth();

  const [formData, setFormData] = useState({
    employer: application.employer,
    jobTitle: application.jobTitle,
    location: application.location,
    jobUrl: application.jobUrl || '',
    salary: parseSalaryRange(application.salaryRange, application.currency),
    contact: application.contact || '',
    platform: application.platform,
    status: application.status,
    newComment: '',
  });

  useEffect(() => {
    setFormData({
      employer: application.employer,
      jobTitle: application.jobTitle,
      location: application.location,
      jobUrl: application.jobUrl || '',
      salary: parseSalaryRange(application.salaryRange, application.currency),
      contact: application.contact || '',
      platform: application.platform,
      status: application.status,
      newComment: '',
    });
  }, [application]);

  const { mutateAsync: updateApplication, isPending } = useUpdateApplication();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.employer || !formData.jobTitle || !formData.location) {
      Toast.error({ description: 'Please fill in all required fields' });
      return;
    }

    if (!user?.id) {
      Toast.error({
        description: 'You must be logged in to update applications',
      });
      return;
    }

    try {
      const salaryRange =
        formData.salary.min && formData.salary.max
          ? `${formData.salary.min} - ${formData.salary.max}`
          : null;

      const response = await updateApplication({
        applicationId: application.id,
        userId: user.id,
        data: {
          employer: formData.employer,
          jobTitle: formData.jobTitle,
          location: formData.location,
          jobUrl: formData.jobUrl || null,
          salaryRange,
          currency: formData.salary.currency,
          contact: formData.contact || null,
          platform: formData.platform,
          status: formData.status,
          newComment: formData.newComment || undefined,
        },
      });

      if (response.success) {
        Toast.success({ description: 'Application updated successfully' });
        modalRef.current?.close();
        onSuccess?.();
      }
    } catch (error) {
      console.error('Update error:', error);
      Toast.error({ description: 'Failed to update application' });
    }
  };

  return (
    <Modal
      modalRef={modalRef}
      size="3xl"
      className="bg-light rounded-xl"
      hideCloseButton={false}
    >
      <div className="p-6">
        {/* Header */}
        <H4 className="text-primary mb-6">Edit Application</H4>

        <div className="grid gap-5">
          {/* Company & Job Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <CompanyIcon className="size-4 text-primary" />
                <H6 className="text-primary font-semibold text-sm">
                  Company Name
                </H6>
              </div>
              <InputName
                hasLabel={false}
                hasIcon={false}
                placeholder="Enter company name"
                value={formData.employer}
                onChange={(value: string) =>
                  handleInputChange('employer', value)
                }
                isRequired
                className="[&_input]:bg-light [&>div]:bg-light"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <JobIcon className="size-4 text-primary" />
                <H6 className="text-primary font-semibold text-sm">
                  Job Title
                </H6>
              </div>
              <InputName
                hasLabel={false}
                hasIcon={false}
                placeholder="Enter job title"
                value={formData.jobTitle}
                onChange={(value: string) =>
                  handleInputChange('jobTitle', value)
                }
                isRequired
                className="[&_input]:bg-light [&>div]:bg-light"
              />
            </div>
          </div>

          {/* Location & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <LocationIcon className="size-4 text-primary" />
                <H6 className="text-primary font-semibold text-sm">Location</H6>
              </div>
              <LocationSelect
                size="sm"
                placeholder="Select location"
                onChange={(value) => handleInputChange('location', value)}
              />
            </div>

            <InputSalary
              size="sm"
              values={[formData.salary.min || '', formData.salary.max || '']}
              currency={formData.salary.currency}
              onChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  salary: value,
                }))
              }
              className="[&_input]:bg-light [&>div>div]:bg-light"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <H6 className="text-primary font-semibold text-sm">Job URL</H6>
              <Input
                placeholder="Link to job posting"
                value={formData.jobUrl}
                onValueChange={(value: string) =>
                  handleInputChange('jobUrl', value)
                }
                inputClassName="bg-light"
                inputWrapperClassName="bg-light"
              />
            </div>
            <div className="flex flex-col gap-2">
              <H6 className="text-primary font-semibold text-sm">
                Contact Person
              </H6>
              <Input
                placeholder="Recruiter or hiring manager"
                value={formData.contact}
                onValueChange={(value: string) =>
                  handleInputChange('contact', value)
                }
                inputClassName="bg-light"
                inputWrapperClassName="bg-light"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <H6 className="text-primary font-semibold text-sm">Platform</H6>
              <PlatformSelector
                size="sm"
                placeholder="Where did you find this job?"
                onChange={(value) => handleInputChange('platform', value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <H6 className="text-primary font-semibold text-sm">Status</H6>
              <StatusSelector
                size="sm"
                placeholder="Current application status"
                onChange={(value) => handleInputChange('status', value)}
              />
            </div>
          </div>

          {/* Add Comment */}
          <div className="flex flex-col gap-2">
            <H6 className="text-primary font-semibold text-sm">
              Add Comment (Optional)
            </H6>
            <Input
              placeholder="Add a note about this update..."
              value={formData.newComment}
              onValueChange={(value: string) =>
                handleInputChange('newComment', value)
              }
              inputClassName="bg-light"
              inputWrapperClassName="bg-light"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-border">
          <Button variant="light" onPress={() => modalRef.current?.close()}>
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={isPending}
            isDisabled={
              !formData.employer || !formData.jobTitle || !formData.location
            }
          >
            Save Changes
          </Button>
        </div>
      </div>
    </Modal>
  );
};
