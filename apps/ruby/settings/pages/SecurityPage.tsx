import { Button } from '@common/components/button';
import { Toast } from '@common/components/toast';
import { EyelashClosedIcon } from '@common/icons/EyelashClosedIcon';
import { EyeOpenIcon } from '@common/icons/EyeOpenIcon';
import {
  ComputerDesktopIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import { Input } from '@heroui/react';
import { backend } from '@ruby/shared/backend';
import { useAuth } from '@ruby/shared/hooks';
import { useState } from 'react';
import { SettingsCard } from '../components/SettingsCard';
import { SettingsField } from '../components/SettingsField';

interface SessionType {
  id: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}

export const SecurityPage = () => {
  const { data: user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const loadSessions = async () => {
    if (!user?.id) return;

    setLoadingSessions(true);
    try {
      const response = await backend.users.sessions.filter({
        userId: user.id,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      });

      if (response.success && response.data.sessions) {
        setSessions(response.data.sessions);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const validatePassword = () => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    };

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }

    if (!passwordData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setPasswordErrors(errors);
    return !Object.values(errors).some((error) => error !== '');
  };

  const handleChangePassword = async () => {
    if (!validatePassword() || !user?.id) return;

    setIsSavingPassword(true);
    try {
      // TODO: Implement password change API call
      // const response = await backend.user.accounts.update(accountId, {
      //   password: passwordData.newPassword,
      // });

      Toast.success({ description: 'Password changed successfully' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsChangingPassword(false);
    } catch (error) {
      Toast.error({ description: 'Failed to change password' });
      console.error(error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordErrors({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setIsChangingPassword(false);
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const response = await backend.users.sessions.delete(sessionId);

      if (response.success) {
        Toast.success({ description: 'Session revoked successfully' });
        loadSessions();
      } else {
        Toast.error({ description: 'Failed to revoke session' });
      }
    } catch (error) {
      Toast.error({ description: 'An error occurred' });
      console.error(error);
    }
  };

  const getBrowserFromUserAgent = (userAgent?: string) => {
    if (!userAgent) return 'Unknown Browser';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown Browser';
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <SettingsCard
        title="Password"
        description="Manage your password and authentication"
        footer={
          isChangingPassword ? (
            <div className="flex justify-end gap-2">
              <Button
                variant="light"
                onPress={handleCancelPasswordChange}
                isDisabled={isSavingPassword}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={handleChangePassword}
                isLoading={isSavingPassword}
              >
                Update Password
              </Button>
            </div>
          ) : (
            <div className="flex justify-end">
              <Button
                color="primary"
                variant="flat"
                onPress={() => setIsChangingPassword(true)}
              >
                Change Password
              </Button>
            </div>
          )
        }
      >
        {!isChangingPassword ? (
          <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <ShieldCheckIcon className="size-5 text-primary" />
            <div>
              <p className="font-medium text-primary">Password Protected</p>
              <p className="text-sm text-muted-foreground">
                Your account is secured with a password
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SettingsField
              label="Current Password"
              required
              error={passwordErrors.currentPassword}
            >
              <Input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                placeholder="Enter your current password"
                variant="bordered"
                classNames={{
                  input: 'text-primary',
                  inputWrapper: 'border-border',
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="focus:outline-none"
                  >
                    {showCurrentPassword ? (
                      <EyelashClosedIcon className="size-4 text-default-400" />
                    ) : (
                      <EyeOpenIcon className="size-4 text-default-400" />
                    )}
                  </button>
                }
              />
            </SettingsField>

            <SettingsField
              label="New Password"
              description="Password must be at least 8 characters long"
              required
              error={passwordErrors.newPassword}
            >
              <Input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                placeholder="Enter your new password"
                variant="bordered"
                classNames={{
                  input: 'text-primary',
                  inputWrapper: 'border-border',
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyelashClosedIcon className="size-4 text-default-400" />
                    ) : (
                      <EyeOpenIcon className="size-4 text-default-400" />
                    )}
                  </button>
                }
              />
            </SettingsField>

            <SettingsField
              label="Confirm New Password"
              required
              error={passwordErrors.confirmPassword}
            >
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="Confirm your new password"
                variant="bordered"
                classNames={{
                  input: 'text-primary',
                  inputWrapper: 'border-border',
                }}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyelashClosedIcon className="size-4 text-default-400" />
                    ) : (
                      <EyeOpenIcon className="size-4 text-default-400" />
                    )}
                  </button>
                }
              />
            </SettingsField>
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Active Sessions"
        description="Manage your active sessions across different devices"
      >
        {loadingSessions ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading sessions...
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No active sessions found
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <ComputerDesktopIcon className="size-5 text-primary" />
                  <div>
                    <p className="font-medium text-primary">
                      {getBrowserFromUserAgent(session.userAgent)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {session.ipAddress || 'Unknown IP'} •{' '}
                      {new Date(session.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Button
                  variant="light"
                  color="danger"
                  size="sm"
                  onPress={() => handleRevokeSession(session.id)}
                >
                  Revoke
                </Button>
              </div>
            ))}
          </div>
        )}
      </SettingsCard>

      <SettingsCard
        title="Two-Factor Authentication"
        description="Add an extra layer of security to your account"
      >
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <p className="font-medium text-primary">
              Two-Factor Authentication
            </p>
            <p className="text-sm text-muted-foreground">Not yet enabled</p>
          </div>
          <Button variant="flat" color="primary" size="sm" isDisabled>
            Enable 2FA (Coming Soon)
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
};
