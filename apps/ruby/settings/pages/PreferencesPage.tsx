import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { Divider, Select, SelectItem, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';

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

  const handlePreferenceChange = (key: string, value: unknown) => {
    setPreferences({ ...preferences, [key]: value });
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement preferences save API call
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
    { key: 'light', label: 'Light', icon: 'heroicons:sun' },
    { key: 'dark', label: 'Dark', icon: 'heroicons:moon' },
    { key: 'system', label: 'System', icon: 'heroicons:computer-desktop' },
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

  const shortcuts = [
    { action: 'Save', keys: 'Ctrl + S' },
    { action: 'Create New', keys: 'Ctrl + N' },
    { action: 'Search', keys: 'Ctrl + K' },
    { action: 'Settings', keys: 'Ctrl + ,' },
    { action: 'Help', keys: 'Ctrl + ?' },
    { action: 'Close', keys: 'Esc' },
  ];

  return (
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="p-6 w-full space-y-6">
        {/* Top Row - Appearance and Localization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Appearance */}
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:paint-brush"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Appearance</H6>
                  <p className="text-xs text-secondary-text">
                    Customize how the application looks
                  </p>
                </div>
              </div>

              <Divider className="bg-border" />

              <div className="space-y-4">
                <div className="space-y-2">
                  <Select
                    label="Theme"
                    aria-label="Theme"
                    labelPlacement="outside"
                    selectedKeys={[preferences.theme]}
                    onSelectionChange={(keys) => {
                      const value = Array.from(keys)[0] as string;
                      handlePreferenceChange('theme', value);
                    }}
                    variant="bordered"
                    size="sm"
                    classNames={{
                      label: 'text-sm font-medium text-primary',
                      trigger: 'border-border',
                      value: 'text-primary',
                    }}
                  >
                    {themeOptions.map((option) => (
                      <SelectItem key={option.key} textValue={option.key}>
                        <div className="flex items-center gap-2">
                          <Icon icon={option.icon} className="size-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:view-columns"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="text-sm font-medium text-primary">
                        Compact View
                      </p>
                      <p className="text-xs text-secondary-text">
                        Fit more content on screen
                      </p>
                    </div>
                  </div>
                  <Switch
                    isSelected={preferences.compactView}
                    onValueChange={(value) =>
                      handlePreferenceChange('compactView', value)
                    }
                    color="primary"
                    size="sm"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Localization */}
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:globe-alt"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Localization</H6>
                  <p className="text-xs text-secondary-text">
                    Language, timezone, and regional settings
                  </p>
                </div>
              </div>

              <Divider className="bg-border" />

              <div className="space-y-4">
                <Select
                  label="Language"
                  aria-label="Language"
                  labelPlacement="outside"
                  selectedKeys={[preferences.language]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    handlePreferenceChange('language', value);
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-sm font-medium text-primary',
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

                <Select
                  label="Timezone"
                  aria-label="Timezone"
                  labelPlacement="outside"
                  selectedKeys={[preferences.timezone]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    handlePreferenceChange('timezone', value);
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-sm font-medium text-primary',
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

                <Select
                  label="Date Format"
                  aria-label="Date Format"
                  labelPlacement="outside"
                  selectedKeys={[preferences.dateFormat]}
                  onSelectionChange={(keys) => {
                    const value = Array.from(keys)[0] as string;
                    handlePreferenceChange('dateFormat', value);
                  }}
                  variant="bordered"
                  size="sm"
                  classNames={{
                    label: 'text-sm font-medium text-primary',
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
              </div>
            </div>
          </Card>
        </div>

        {/* Functionality */}
        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon
                  icon="heroicons:cog-6-tooth"
                  className="size-5 text-primary"
                />
              </div>
              <div>
                <H6 className="text-primary">Functionality</H6>
                <p className="text-xs text-secondary-text">
                  Configure how the application behaves
                </p>
              </div>
            </div>

            <Divider className="bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:document-check"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Auto-Save
                    </p>
                    <p className="text-xs text-secondary-text">
                      Save work automatically
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={preferences.autoSave}
                  onValueChange={(value) =>
                    handlePreferenceChange('autoSave', value)
                  }
                  color="primary"
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:bell"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Notifications
                    </p>
                    <p className="text-xs text-secondary-text">
                      Show in-app alerts
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={preferences.showNotifications}
                  onValueChange={(value) =>
                    handlePreferenceChange('showNotifications', value)
                  }
                  color="primary"
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:chart-bar"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Analytics
                    </p>
                    <p className="text-xs text-secondary-text">
                      Share usage data
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={preferences.enableAnalytics}
                  onValueChange={(value) =>
                    handlePreferenceChange('enableAnalytics', value)
                  }
                  color="primary"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon
                  icon="heroicons:command-line"
                  className="size-5 text-primary"
                />
              </div>
              <div>
                <H6 className="text-primary">Keyboard Shortcuts</H6>
                <p className="text-xs text-secondary-text">
                  Quick actions for power users
                </p>
              </div>
            </div>

            <Divider className="bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.action}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                >
                  <span className="text-sm text-primary">
                    {shortcut.action}
                  </span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-primary bg-primary/10 border border-border rounded">
                    {shortcut.keys}
                  </kbd>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Save Button */}
        {hasChanges && (
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button variant="light" onPress={handleReset} isDisabled={isSaving}>
              Reset to Defaults
            </Button>
            <Button
              color="primary"
              size="md"
              onPress={handleSave}
              isLoading={isSaving}
              className="px-8"
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
