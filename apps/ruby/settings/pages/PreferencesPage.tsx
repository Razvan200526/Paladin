import { Button } from '@common/components/button';
import { Toast } from '@common/components/toast';
import { Select, SelectItem, Switch } from '@heroui/react';
import { useState } from 'react';
import { SettingsCard } from '../components/SettingsCard';
import { SettingsField } from '../components/SettingsField';

export const PreferencesPage = () => {
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    autoSave: true,
    showNotifications: true,
    compactView: false,
    enableAnalytics: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences({ ...preferences, [key]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement preferences save API call
      // await backend.user.updatePreferences(user?.id, preferences);

      Toast.success({ description: 'Preferences saved successfully' });
      setHasChanges(false);
    } catch (error) {
      Toast.error({ description: 'Failed to save preferences' });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setPreferences({
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      autoSave: true,
      showNotifications: true,
      compactView: false,
      enableAnalytics: true,
    });
    setHasChanges(false);
    Toast.info({ description: 'Preferences reset to defaults' });
  };

  const themeOptions = [
    { key: 'light', label: 'Light' },
    { key: 'dark', label: 'Dark' },
    { key: 'system', label: 'System' },
  ];

  const languageOptions = [
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Spanish' },
    { key: 'fr', label: 'French' },
    { key: 'de', label: 'German' },
  ];

  const timezoneOptions = [
    { key: 'UTC', label: 'UTC' },
    { key: 'America/New_York', label: 'Eastern Time (ET)' },
    { key: 'America/Chicago', label: 'Central Time (CT)' },
    { key: 'America/Denver', label: 'Mountain Time (MT)' },
    { key: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { key: 'Europe/London', label: 'London (GMT)' },
    { key: 'Europe/Paris', label: 'Paris (CET)' },
    { key: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  ];

  const dateFormatOptions = [
    { key: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { key: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { key: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <SettingsCard
        title="Appearance"
        description="Customize how the application looks"
        footer={
          hasChanges && (
            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                onPress={handleReset}
                isDisabled={isSaving}
              >
                Reset to Defaults
              </Button>
              <Button color="primary" onPress={handleSave} isLoading={isSaving}>
                Save Changes
              </Button>
            </div>
          )
        }
      >
        <SettingsField
          label="Theme"
          description="Choose your preferred color theme"
        >
          <Select
            aria-label="theme"
            selectedKeys={[preferences.theme]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePreferenceChange('theme', value);
            }}
            variant="bordered"
            classNames={{
              trigger: 'border-border',
              value: 'text-primary',
            }}
          >
            {themeOptions.map((option) => (
              <SelectItem key={option.key} textValue={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </SettingsField>

        <SettingsField
          label="Compact View"
          description="Use a more compact layout to fit more content on screen"
        >
          <Switch
            isSelected={preferences.compactView}
            onValueChange={(value) =>
              handlePreferenceChange('compactView', value)
            }
            color="primary"
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Localization"
        description="Set your language, timezone, and regional preferences"
      >
        <SettingsField
          label="Language"
          description="Select your preferred language"
        >
          <Select
            selectedKeys={[preferences.language]}
            aria-label="language"
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePreferenceChange('language', value);
            }}
            variant="bordered"
            classNames={{
              trigger: 'border-border',
              value: 'text-primary',
            }}
          >
            {languageOptions.map((option) => (
              <SelectItem key={option.key} textValue={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </SettingsField>

        <SettingsField
          label="Timezone"
          description="Choose your timezone for accurate timestamps"
        >
          <Select
            aria-label="timezone"
            selectedKeys={[preferences.timezone]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePreferenceChange('timezone', value);
            }}
            variant="bordered"
            classNames={{
              trigger: 'border-border',
              value: 'text-primary',
            }}
          >
            {timezoneOptions.map((option) => (
              <SelectItem key={option.key} textValue={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </SettingsField>

        <SettingsField
          label="Date Format"
          description="Choose how dates are displayed"
        >
          <Select
            aria-label="date"
            selectedKeys={[preferences.dateFormat]}
            onSelectionChange={(keys) => {
              const value = Array.from(keys)[0] as string;
              handlePreferenceChange('dateFormat', value);
            }}
            variant="bordered"
            classNames={{
              trigger: 'border-border',
              value: 'text-primary',
            }}
          >
            {dateFormatOptions.map((option) => (
              <SelectItem key={option.key} textValue={option.key}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Functionality"
        description="Configure how the application behaves"
      >
        <SettingsField
          label="Auto-Save"
          description="Automatically save your work as you type"
        >
          <Switch
            isSelected={preferences.autoSave}
            onValueChange={(value) => handlePreferenceChange('autoSave', value)}
            color="primary"
          />
        </SettingsField>

        <SettingsField
          label="Notifications"
          description="Show in-app notifications for important events"
        >
          <Switch
            isSelected={preferences.showNotifications}
            onValueChange={(value) =>
              handlePreferenceChange('showNotifications', value)
            }
            color="primary"
          />
        </SettingsField>

        <SettingsField
          label="Analytics"
          description="Help us improve by sharing anonymous usage data"
        >
          <Switch
            isSelected={preferences.enableAnalytics}
            onValueChange={(value) =>
              handlePreferenceChange('enableAnalytics', value)
            }
            color="primary"
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Keyboard Shortcuts"
        description="View and customize keyboard shortcuts"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <span className="text-sm text-primary">Save</span>
            <kbd className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 border border-border rounded">
              Ctrl + S
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <span className="text-sm text-primary">Create New</span>
            <kbd className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 border border-border rounded">
              Ctrl + N
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <span className="text-sm text-primary">Search</span>
            <kbd className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 border border-border rounded">
              Ctrl + K
            </kbd>
          </div>
          <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
            <span className="text-sm text-primary">Settings</span>
            <kbd className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 border border-border rounded">
              Ctrl + ,
            </kbd>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
