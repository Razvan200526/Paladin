import { Button } from '@common/components/button';
import { Input } from '@common/components/input';
import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { Toast } from '@common/components/toast';
import { H3, H6 } from '@common/components/typography';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import {
  ScrollShadow,
  Select,
  SelectItem,
  Spinner,
  Textarea,
} from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

import {
  useGetApplication,
  useUpdateApplication,
} from '../hooks/applicationHooks';

type FormData = {
  employer: string;
  jobTitle: string;
  location: string;
  jobUrl: string;
  salaryRange: string;
  contact: string;
  platform: 'Linkedin' | 'Glassdoor' | 'Other';
  status: 'Applied' | 'Interviewing' | 'Accepted' | 'Rejected';
  newComment: string;
};

export const EditApplicationPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: user } = useAuth();

  const {
    data: application,
    isError,
    isFetching,
  } = useGetApplication(id || '');

  const updateMutation = useUpdateApplication();

  const [formData, setFormData] = useState<FormData>({
    employer: '',
    jobTitle: '',
    location: '',
    jobUrl: '',
    salaryRange: '',
    contact: '',
    platform: 'Other',
    status: 'Applied',
    newComment: '',
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (application) {
      setFormData({
        employer: application.employer,
        jobTitle: application.jobTitle,
        location: application.location,
        jobUrl: application.jobUrl || '',
        salaryRange: application.salaryRange || '',
        contact: application.contact || '',
        platform: application.platform,
        status: application.status,
        newComment: '',
      });
    }
  }, [application]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSubmit = async () => {
    if (!formData.employer || !formData.jobTitle || !formData.location) {
      Toast.error({ description: 'Please fill in all required fields' });
      return;
    }

    if (!user?.id || !application?.id) {
      Toast.error({ description: 'Unable to update application' });
      return;
    }

    try {
      const response = await updateMutation.mutateAsync({
        applicationId: application.id,
        userId: user.id,
        data: {
          employer: formData.employer,
          jobTitle: formData.jobTitle,
          location: formData.location,
          jobUrl: formData.jobUrl || null,
          salaryRange: formData.salaryRange || null,
          contact: formData.contact || null,
          platform: formData.platform,
          status: formData.status,
          newComment: formData.newComment || undefined,
        },
      });

      if (response.success) {
        navigate(`/home/applications/${application.id}`);
      }
    } catch (error) {
      console.error('Update error:', error);
      Toast.error({ description: 'Failed to update application' });
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      const confirmed = window.confirm(
        'You have unsaved changes. Are you sure you want to leave?',
      );
      if (!confirmed) return;
    }
    navigate(-1);
  };

  if (isFetching) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError || !application) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <ErrorFallback error={new Error('Could not fetch application')} />
      </div>
    );
  }

  return (
    <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded">
      <ScrollShadow className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="light" isIconOnly onPress={handleCancel}>
                <ArrowLeftIcon className="size-5" />
              </Button>
              <div>
                <H3 className="text-primary font-bold">Edit Application</H3>
                <H6 className="text-muted">
                  {application.jobTitle} at {application.employer}
                </H6>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="light" onPress={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={updateMutation.isPending}
                isDisabled={
                  !formData.employer || !formData.jobTitle || !formData.location
                }
              >
                Save Changes
              </Button>
            </div>
          </div>

          {/* Form */}
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Basic Information */}
            <div className="bg-light border border-border rounded-lg p-6">
              <H6 className="text-lg font-semibold mb-4">Basic Information</H6>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Company Name"
                    placeholder="Enter company name"
                    value={formData.employer}
                    onValueChange={(value: string) =>
                      handleInputChange('employer', value)
                    }
                    isRequired
                  />
                  <Input
                    label="Job Title"
                    placeholder="Enter job title"
                    value={formData.jobTitle}
                    onValueChange={(value: string) =>
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
                    onValueChange={(value: string) =>
                      handleInputChange('location', value)
                    }
                    isRequired
                  />
                  <Input
                    label="Salary Range"
                    placeholder="e.g. $80,000 - $100,000"
                    value={formData.salaryRange}
                    onValueChange={(value: string) =>
                      handleInputChange('salaryRange', value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Job URL"
                    placeholder="Link to job posting"
                    value={formData.jobUrl}
                    onValueChange={(value: string) =>
                      handleInputChange('jobUrl', value)
                    }
                  />
                  <Input
                    label="Contact Person"
                    placeholder="Recruiter or hiring manager"
                    value={formData.contact}
                    onValueChange={(value: string) =>
                      handleInputChange('contact', value)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Status & Platform */}
            <div className="bg-light border border-border rounded-lg p-6">
              <H6 className="text-lg font-semibold mb-4">Status & Platform</H6>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Platform"
                  placeholder="Where did you find this job?"
                  selectedKeys={[formData.platform]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    if (value) handleInputChange('platform', value);
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
                    if (value) handleInputChange('status', value);
                  }}
                >
                  <SelectItem key="applied">Applied</SelectItem>
                  <SelectItem key="interviewing">Interviewing</SelectItem>
                  <SelectItem key="accepted">Accepted</SelectItem>
                  <SelectItem key="rejected">Rejected</SelectItem>
                </Select>
              </div>
            </div>

            {/* Add Comment */}
            <div className="bg-light border border-border rounded-lg p-6">
              <H6 className="text-lg font-semibold mb-4">Add a Note</H6>
              <Textarea
                label="Comment"
                placeholder="Add a note about this update (optional)..."
                value={formData.newComment}
                onValueChange={(value: string) =>
                  handleInputChange('newComment', value)
                }
                minRows={3}
              />
            </div>

            {/* Existing Comments */}
            {application.comments && application.comments.length > 0 && (
              <div className="bg-light border border-border rounded-lg p-6">
                <H6 className="text-lg font-semibold mb-4">
                  Previous Comments
                </H6>
                <ul className="space-y-2">
                  {application.comments.map((comment, index) => (
                    <li
                      key={index}
                      className="text-sm text-secondary-text bg-background p-3 rounded border border-border"
                    >
                      {comment}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="light" onPress={handleCancel}>
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={updateMutation.isPending}
                isDisabled={
                  !formData.employer || !formData.jobTitle || !formData.location
                }
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
};
