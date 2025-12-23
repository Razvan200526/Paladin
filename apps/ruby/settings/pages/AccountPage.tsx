import { Button } from '@common/components/button';
import { Toast } from '@common/components/toast';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Switch } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { useState } from 'react';
import { SettingsCard } from '../components/SettingsCard';
import { SettingsField } from '../components/SettingsField';

export const AccountPage = () => {
  const { data: user } = useAuth();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteAccount = async () => {
    if (!user?.id) return;

    setIsDeleting(true);
    try {
      const response = await backend.users.delete(user.id);

      if (response.success) {
        Toast.success({ description: 'Account deleted successfully' });
        await backend.auth.signout();
      } else {
        Toast.error({
          description: response.message || 'Failed to delete account',
        });
      }
    } catch (error) {
      Toast.error({
        description: 'An error occurred while deleting your account',
      });
      console.error(error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleExportData = async () => {
    try {
      Toast.info({ description: 'Preparing your data export...' });
      // TODO: Implement data export functionality
      setTimeout(() => {
        Toast.success({ description: 'Data export ready for download' });
      }, 2000);
    } catch (error) {
      Toast.error({ description: 'Failed to export data' });
      console.error(error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <SettingsCard
        title="Email Preferences"
        description="Manage your email notification settings"
      >
        <SettingsField
          label="Email Notifications"
          description="Receive email notifications about your account activity"
        >
          <Switch
            isSelected={emailNotifications}
            onValueChange={setEmailNotifications}
            color="primary"
          />
        </SettingsField>

        <SettingsField
          label="Marketing Emails"
          description="Receive emails about new features, tips, and updates"
        >
          <Switch
            isSelected={marketingEmails}
            onValueChange={setMarketingEmails}
            color="primary"
          />
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Data & Privacy"
        description="Manage your data and privacy settings"
      >
        <SettingsField
          label="Download Your Data"
          description="Export all your data including resumes, cover letters, and applications"
        >
          <Button variant="bordered" color="primary" onPress={handleExportData}>
            Export Data
          </Button>
        </SettingsField>
      </SettingsCard>

      <SettingsCard
        title="Account Status"
        description="View your account status and subscription details"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div>
              <p className="font-medium text-primary">Account Status</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
              Active
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
            <div>
              <p className="font-medium text-primary">Subscription Plan</p>
              <p className="text-sm text-muted-foreground">Free Plan</p>
            </div>
            <Button variant="flat" color="primary" size="sm">
              Upgrade
            </Button>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard
        title="Danger Zone"
        description="Irreversible actions that affect your account"
      >
        <div className="space-y-4">
          <div className="p-4 bg-danger/5 rounded-lg border border-danger/20">
            <div className="flex items-start gap-3">
              <ExclamationTriangleIcon className="size-5 text-danger mt-0.5" />
              <div className="flex-1 space-y-2">
                <div>
                  <p className="font-medium text-danger">Delete Account</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your account and all associated data.
                    This action cannot be undone.
                  </p>
                </div>

                {!showDeleteConfirm ? (
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    onPress={() => setShowDeleteConfirm(true)}
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 pt-2">
                    <p className="text-sm font-medium text-danger">
                      Are you sure? This action is permanent.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="light"
                        size="sm"
                        onPress={() => setShowDeleteConfirm(false)}
                        isDisabled={isDeleting}
                      >
                        Cancel
                      </Button>
                      <Button
                        color="danger"
                        size="sm"
                        onPress={handleDeleteAccount}
                        isLoading={isDeleting}
                      >
                        Yes, Delete My Account
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SettingsCard>
    </div>
  );
};
