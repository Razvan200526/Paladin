import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { Divider, Switch } from '@heroui/react';
import { Icon } from '@iconify/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { useState } from 'react';

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
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="p-6 w-full space-y-6">
        {/* Top Row - Account Status and Subscription */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Status */}
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:user-circle"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Account Status</H6>
                  <p className="text-xs text-secondary-text">
                    Your account information
                  </p>
                </div>
              </div>

              <Divider className="bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:check-badge"
                      className="size-5 text-success-500"
                    />
                    <div>
                      <p className="font-medium text-primary">Account Status</p>
                      <p className="text-sm text-secondary-text">
                        Your account is active and verified
                      </p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-xs font-medium">
                    Active
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:calendar"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="font-medium text-primary">Member Since</p>
                      <p className="text-sm text-secondary-text">
                        {user?.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Subscription Plan */}
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:credit-card"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Subscription</H6>
                  <p className="text-xs text-secondary-text">
                    Manage your subscription plan
                  </p>
                </div>
              </div>

              <Divider className="bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:sparkles"
                      className="size-5 text-primary"
                    />
                    <div>
                      <p className="font-medium text-primary">Current Plan</p>
                      <p className="text-sm text-secondary-text">Free Plan</p>
                    </div>
                  </div>
                  <Button variant="flat" color="primary" size="sm">
                    Upgrade
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:document-text"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="font-medium text-primary">Usage</p>
                      <p className="text-sm text-secondary-text">
                        5 of 10 resumes used
                      </p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-border rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-primary rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Email Preferences */}
        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon
                  icon="heroicons:envelope"
                  className="size-5 text-primary"
                />
              </div>
              <div>
                <H6 className="text-primary">Email Preferences</H6>
                <p className="text-xs text-secondary-text">
                  Manage your email notification settings
                </p>
              </div>
            </div>

            <Divider className="bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:bell"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Email Notifications
                    </p>
                    <p className="text-xs text-secondary-text">
                      Account activity alerts
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={emailNotifications}
                  onValueChange={setEmailNotifications}
                  color="primary"
                  size="sm"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:megaphone"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Marketing Emails
                    </p>
                    <p className="text-xs text-secondary-text">
                      Tips, updates, and news
                    </p>
                  </div>
                </div>
                <Switch
                  isSelected={marketingEmails}
                  onValueChange={setMarketingEmails}
                  color="primary"
                  size="sm"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon
                  icon="heroicons:shield-check"
                  className="size-5 text-primary"
                />
              </div>
              <div>
                <H6 className="text-primary">Data & Privacy</H6>
                <p className="text-xs text-secondary-text">
                  Manage your data and privacy settings
                </p>
              </div>
            </div>

            <Divider className="bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:arrow-down-tray"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Download Your Data
                    </p>
                    <p className="text-xs text-secondary-text">
                      Export all your data
                    </p>
                  </div>
                </div>
                <Button
                  variant="bordered"
                  color="primary"
                  size="sm"
                  onPress={handleExportData}
                >
                  Export
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <Icon
                    icon="heroicons:document-duplicate"
                    className="size-5 text-secondary-text"
                  />
                  <div>
                    <p className="text-sm font-medium text-primary">
                      Privacy Policy
                    </p>
                    <p className="text-xs text-secondary-text">
                      Read our privacy policy
                    </p>
                  </div>
                </div>
                <Button variant="light" color="primary" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-light border border-danger/30 hover:border-danger/50 transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-danger/10">
                <Icon
                  icon="heroicons:exclamation-triangle"
                  className="size-5 text-danger"
                />
              </div>
              <div>
                <H6 className="text-danger">Danger Zone</H6>
                <p className="text-xs text-secondary-text">
                  Irreversible actions that affect your account
                </p>
              </div>
            </div>

            <Divider className="bg-danger/20" />

            <div className="p-4 bg-danger/5 rounded-lg border border-danger/20">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="heroicons:trash"
                    className="size-5 text-danger mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-danger">Delete Account</p>
                    <p className="text-sm text-secondary-text">
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                  </div>
                </div>

                {!showDeleteConfirm ? (
                  <Button
                    variant="flat"
                    color="danger"
                    size="sm"
                    onPress={() => setShowDeleteConfirm(true)}
                    className="shrink-0"
                  >
                    Delete Account
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 shrink-0">
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
                      Confirm Delete
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
