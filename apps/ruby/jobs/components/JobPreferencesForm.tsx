import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { Input } from '@common/components/input';
import { H5 } from '@common/components/typography';
import { PlusIcon } from '@heroicons/react/24/outline';
import {
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Slider,
  Switch,
} from '@heroui/react';
import { useAuth } from '@ruby/shared/hooks';
import { useEffect, useState } from 'react';
import type { JobPreferences } from '../../../sdk/JobFetcher';
import { useUpdateJobPreferences } from '../hooks';

interface JobPreferencesFormProps {
  isOpen: boolean;
  onClose: () => void;
  preferences?: JobPreferences;
}

const JOB_TYPES = [
  'full-time',
  'part-time',
  'contract',
  'temporary',
  'internship',
];
const EXPERIENCE_LEVELS = [
  'entry',
  'junior',
  'mid',
  'senior',
  'lead',
  'executive',
];

export const JobPreferencesForm = ({
  isOpen,
  onClose,
  preferences,
}: JobPreferencesFormProps) => {
  const { data: user } = useAuth();
  const userId = user?.id;
  const { mutate: updatePreferences, isPending } = useUpdateJobPreferences();

  const [desiredTitles, setDesiredTitles] = useState<string[]>([]);
  const [desiredLocations, setDesiredLocations] = useState<string[]>([]);
  const [isRemotePreferred, setIsRemotePreferred] = useState(false);
  const [minSalary, setMinSalary] = useState<number | undefined>();
  const [salaryCurrency, setSalaryCurrency] = useState('USD');
  const [jobTypes, setJobTypes] = useState<string[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [excludedCompanies, setExcludedCompanies] = useState<string[]>([]);
  const [notifyThreshold, setNotifyThreshold] = useState(70);
  const [notifyHighMatches, setNotifyHighMatches] = useState(true);
  const [notifyFrequency, setNotifyFrequency] = useState<
    'instant' | 'daily' | 'weekly'
  >('daily');

  const [titleInput, setTitleInput] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');

  useEffect(() => {
    if (preferences) {
      setDesiredTitles(preferences.desiredTitles || []);
      setDesiredLocations(preferences.desiredLocations || []);
      setIsRemotePreferred(preferences.isRemotePreferred || false);
      setMinSalary(preferences.minSalary);
      setSalaryCurrency(preferences.salaryCurrency || 'USD');
      setJobTypes(preferences.jobTypes || []);
      setExperienceLevels(preferences.experienceLevels || []);
      setSkills(preferences.skills || []);
      setExcludedCompanies(preferences.excludedCompanies || []);
      setNotifyThreshold(preferences.notifyThreshold || 70);
      setNotifyHighMatches(preferences.notifyHighMatches ?? true);
      setNotifyFrequency(preferences.notifyFrequency ?? 'daily');
    }
  }, [preferences]);

  const handleAddItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    inputSetter: React.Dispatch<React.SetStateAction<string>>,
  ) => {
    const trimmed = value.trim();
    if (trimmed) {
      setter((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
      inputSetter('');
    }
  };

  const handleRemoveItem = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    setter((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmit = () => {
    if (!userId) return;
    updatePreferences(
      {
        userId,
        desiredTitles,
        desiredLocations,
        isRemotePreferred,
        minSalary,
        salaryCurrency,
        jobTypes,
        experienceLevels,
        skills,
        excludedCompanies,
        notifyThreshold,
        notifyHighMatches,
        notifyFrequency,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const renderChipsInput = (
    label: string,
    items: string[],
    setItems: React.Dispatch<React.SetStateAction<string[]>>,
    inputValue: string,
    setInputValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder: string,
    inputId: string,
  ) => (
    <div className="space-y-2">
      <label htmlFor={inputId} className="text-sm font-medium text-primary">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          id={inputId}
          size="sm"
          placeholder={placeholder}
          value={inputValue}
          onValueChange={(val) => setInputValue(val)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAddItem(inputValue, setItems, setInputValue);
            }
          }}
        />
        <Button
          isIconOnly
          size="sm"
          variant="flat"
          onPress={() => handleAddItem(inputValue, setItems, setInputValue)}
        >
          <PlusIcon className="w-4 h-4" />
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <Chip
              key={item}
              size="sm"
              variant="flat"
              onClose={() => handleRemoveItem(item, setItems)}
            >
              {item}
            </Chip>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-light',
        header: 'border-b border-border',
        footer: 'border-t border-border',
      }}
    >
      <ModalContent>
        <ModalHeader>
          <H5 className="text-primary">Job Preferences</H5>
        </ModalHeader>
        <ModalBody className="space-y-6 py-4">
          {/* Job Titles */}
          {renderChipsInput(
            'Desired Job Titles',
            desiredTitles,
            setDesiredTitles,
            titleInput,
            setTitleInput,
            'e.g., Software Engineer',
            'desired-titles-input',
          )}

          {/* Locations */}
          {renderChipsInput(
            'Preferred Locations',
            desiredLocations,
            setDesiredLocations,
            locationInput,
            setLocationInput,
            'e.g., San Francisco, CA',
            'desired-locations-input',
          )}

          {/* Remote Only */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary">
                Remote Preferred
              </p>
              <p className="text-xs text-muted">
                Prefer remote job opportunities
              </p>
            </div>
            <Switch
              isSelected={isRemotePreferred}
              onValueChange={setIsRemotePreferred}
            />
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-primary">
              Minimum Salary
            </span>
            <div className="flex gap-2">
              <Input
                size="sm"
                type="number"
                placeholder="e.g., 80000"
                value={minSalary?.toString() || ''}
                onValueChange={(val) =>
                  setMinSalary(val ? Number.parseInt(val, 10) : undefined)
                }
                startContent={<span className="text-muted text-sm">$</span>}
                className="flex-1"
              />
              <Select
                size="sm"
                selectedKeys={[salaryCurrency]}
                onSelectionChange={(keys) =>
                  setSalaryCurrency(Array.from(keys)[0] as string)
                }
                className="w-24"
              >
                <SelectItem key="USD">USD</SelectItem>
                <SelectItem key="EUR">EUR</SelectItem>
                <SelectItem key="GBP">GBP</SelectItem>
                <SelectItem key="CAD">CAD</SelectItem>
                <SelectItem key="AUD">AUD</SelectItem>
              </Select>
            </div>
          </div>

          {/* Job Types */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-primary">Job Types</span>
            <div className="flex flex-wrap gap-2">
              {JOB_TYPES.map((type) => (
                <Chip
                  key={type}
                  size="sm"
                  variant={jobTypes.includes(type) ? 'solid' : 'flat'}
                  color={jobTypes.includes(type) ? 'primary' : 'default'}
                  className="cursor-pointer"
                  onClick={() => {
                    if (jobTypes.includes(type)) {
                      setJobTypes(jobTypes.filter((t) => t !== type));
                    } else {
                      setJobTypes([...jobTypes, type]);
                    }
                  }}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Chip>
              ))}
            </div>
          </div>

          {/* Experience Levels */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-primary">
              Experience Levels
            </span>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <Chip
                  key={level}
                  size="sm"
                  variant={experienceLevels.includes(level) ? 'solid' : 'flat'}
                  color={
                    experienceLevels.includes(level) ? 'primary' : 'default'
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    if (experienceLevels.includes(level)) {
                      setExperienceLevels(
                        experienceLevels.filter((l) => l !== level),
                      );
                    } else {
                      setExperienceLevels([...experienceLevels, level]);
                    }
                  }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Chip>
              ))}
            </div>
          </div>

          {/* Skills */}
          {renderChipsInput(
            'Required Skills',
            skills,
            setSkills,
            skillInput,
            setSkillInput,
            'e.g., React, TypeScript',
            'skills-input',
          )}

          {/* Exclude Companies */}
          {renderChipsInput(
            'Exclude Companies',
            excludedCompanies,
            setExcludedCompanies,
            companyInput,
            setCompanyInput,
            'e.g., Company to exclude',
            'exclude-companies-input',
          )}

          {/* Notification Settings */}
          <Card className="p-4 bg-background/50 border border-border space-y-4">
            <h4 className="font-medium text-primary text-sm">
              Notification Settings
            </h4>

            <div className="space-y-2">
              <span className="text-sm text-primary">
                Notify Threshold: {notifyThreshold}%
              </span>
              <Slider
                size="sm"
                step={5}
                minValue={50}
                maxValue={100}
                value={notifyThreshold}
                onChange={(value) => setNotifyThreshold(value as number)}
                className="max-w-full"
              />
              <p className="text-xs text-muted">
                Only notify for jobs with compatibility above this threshold
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary">High Match Notifications</p>
                <p className="text-xs text-muted">
                  Get notified when high-scoring matches are found
                </p>
              </div>
              <Switch
                isSelected={notifyHighMatches}
                onValueChange={setNotifyHighMatches}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-primary">Notification Frequency</p>
                <p className="text-xs text-muted">
                  How often to receive match notifications
                </p>
              </div>
              <Select
                size="sm"
                selectedKeys={[notifyFrequency]}
                onSelectionChange={(keys) =>
                  setNotifyFrequency(
                    Array.from(keys)[0] as 'instant' | 'daily' | 'weekly',
                  )
                }
                className="w-24"
              >
                <SelectItem key="instant">Instant</SelectItem>
                <SelectItem key="daily">Daily</SelectItem>
                <SelectItem key="weekly">Weekly</SelectItem>
              </Select>
            </div>
          </Card>
        </ModalBody>
        <ModalFooter>
          <Button variant="flat" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSubmit} isLoading={isPending}>
            Save Preferences
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
