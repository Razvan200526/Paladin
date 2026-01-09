import { Card } from '@common/components/card';
import { H6 } from '@common/components/typography';
import { Divider, Select, SelectItem, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

interface ProfilePreferencesProps {
  preferences?: {
    profileVisibility?: 'public' | 'private' | 'connections';
    openToWork?: boolean;
    jobType?: string;
    remotePreference?: string;
  };
  onPreferencesChange?: (preferences: Record<string, unknown>) => void;
}

export const ProfilePreferences = ({
  preferences,
  onPreferencesChange,
}: ProfilePreferencesProps) => {
  const [profileVisibility, setProfileVisibility] = useState(
    preferences?.profileVisibility || 'public',
  );
  const [openToWork, setOpenToWork] = useState(
    preferences?.openToWork ?? false,
  );
  const [jobType, setJobType] = useState(preferences?.jobType || 'full-time');
  const [remotePreference, setRemotePreference] = useState(
    preferences?.remotePreference || 'hybrid',
  );

  const handleChange = (key: string, value: unknown) => {
    const updates: Record<string, unknown> = {
      profileVisibility,
      openToWork,
      jobType,
      remotePreference,
      [key]: value,
    };
    onPreferencesChange?.(updates);
  };

  const visibilityOptions = [
    { key: 'public', label: 'Public', description: 'Anyone can see' },
    { key: 'private', label: 'Private', description: 'Only you' },
    { key: 'connections', label: 'Connections', description: 'Your network' },
  ];

  const jobTypeOptions = [
    { key: 'full-time', label: 'Full-time' },
    { key: 'part-time', label: 'Part-time' },
    { key: 'contract', label: 'Contract' },
    { key: 'internship', label: 'Internship' },
    { key: 'freelance', label: 'Freelance' },
  ];

  const remoteOptions = [
    { key: 'remote', label: 'Remote Only' },
    { key: 'hybrid', label: 'Hybrid' },
    { key: 'onsite', label: 'On-site' },
    { key: 'flexible', label: 'Flexible' },
  ];

  return (
    <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon
              icon="heroicons:adjustments-horizontal"
              className="size-5 text-primary"
            />
          </div>
          <div>
            <H6 className="text-primary">Profile Preferences</H6>
            <p className="text-xs text-secondary-text">
              Control your profile visibility and job preferences
            </p>
          </div>
        </div>

        <Divider className="bg-border" />

        <div className="space-y-5">
          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                icon="heroicons:eye"
                className="size-5 text-secondary-text"
              />
              <div>
                <p className="text-sm font-medium text-primary">
                  Profile Visibility
                </p>
                <p className="text-xs text-secondary-text">
                  Who can see your profile
                </p>
              </div>
            </div>
            <Select
              aria-label="Profile visibility"
              selectedKeys={[profileVisibility]}
              onSelectionChange={(keys) => {
                const value = Array.from(keys)[0] as string;
                setProfileVisibility(
                  value as 'public' | 'private' | 'connections',
                );
                handleChange('profileVisibility', value);
              }}
              variant="bordered"
              size="sm"
              className="w-40"
              classNames={{
                trigger: 'border-border',
                value: 'text-primary',
              }}
            >
              {visibilityOptions.map((option) => (
                <SelectItem key={option.key} textValue={option.key}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Open to Work */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon
                icon="heroicons:briefcase"
                className="size-5 text-secondary-text"
              />
              <div>
                <p className="text-sm font-medium text-primary">Open to Work</p>
                <p className="text-xs text-secondary-text">
                  Let recruiters know you're available
                </p>
              </div>
            </div>
            <Switch
              isSelected={openToWork}
              onValueChange={(value) => {
                setOpenToWork(value);
                handleChange('openToWork', value);
              }}
              color="primary"
              size="sm"
            />
          </div>

          {openToWork && (
            <>
              <Divider className="bg-border" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-8">
                {/* Job Type */}
                <Select
                  label="Preferred Job Type"
                  aria-label="Job type"
                  labelPlacement="outside"
                  selectedKeys={[jobType]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setJobType(value);
                    handleChange('jobType', value);
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-sm font-medium text-primary',
                    trigger: 'border-border',
                    value: 'text-primary',
                  }}
                >
                  {jobTypeOptions.map((option) => (
                    <SelectItem key={option.key} textValue={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>

                {/* Remote Preference */}
                <Select
                  label="Work Location"
                  aria-label="Remote preference"
                  labelPlacement="outside"
                  selectedKeys={[remotePreference]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    setRemotePreference(value);
                    handleChange('remotePreference', value);
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-sm font-medium text-primary',
                    trigger: 'border-border',
                    value: 'text-primary',
                  }}
                >
                  {remoteOptions.map((option) => (
                    <SelectItem key={option.key} textValue={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};
