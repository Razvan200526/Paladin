import { Button } from '@common/components/button';
import { Card } from '@common/components/card';
import { Toast } from '@common/components/toast';
import { H6 } from '@common/components/typography';
import { isUserPasswordValid } from '@common/validators/isUserPasswordValid';
import { Divider, ScrollShadow } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useSessions, useRevokeSession } from '@ruby/settings/hooks';
import { useAuth } from '@ruby/shared/hooks';
import { useRef, useState } from 'react';
import {
  InputPassword,
  type InputPasswordRefType,
} from '@common/components/input';
import {
  InputConfirmPassword,
  type InputConfirmPasswordRefType,
} from '@common/components/input/InputConfirmPassword';
import { KeyIcon } from '@heroicons/react/24/outline';

export const SecurityPage = () => {
  const { data: user } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const {
    data: sessions = [],
    isLoading: loadingSessions,
    refetch: loadSessions,
  } = useSessions(user?.id || '');
  const { mutateAsync: revokeSession } = useRevokeSession();

  const currentPasswordRef = useRef<InputPasswordRefType | null>(null);
  const newPasswordRef = useRef<InputPasswordRefType | null>(null);
  const confirmPasswordRef = useRef<InputConfirmPasswordRefType | null>(null);

  const handleChangePassword = async () => {
    if (!isUserPasswordValid(newPasswordRef.current?.getValue())) {
      Toast.error({
        description:
          'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      // TODO: Implement password change API call
      Toast.success({ description: 'Password changed successfully' });
      currentPasswordRef.current?.setValue('');
      newPasswordRef.current?.setValue('');
      confirmPasswordRef.current?.setValue('');
      setIsChangingPassword(false);
    } catch (error) {
      Toast.error({ description: 'Failed to change password' });
      console.error(error);
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleCancelPasswordChange = () => {
    currentPasswordRef.current?.setValue('');
    newPasswordRef.current?.setValue('');
    confirmPasswordRef.current?.setValue('');
    setIsChangingPassword(false);
  };

  const handleRevokeSession = async (sessionId: string) => {
    await revokeSession(sessionId);
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
    <div className="h-[calc(100dvh-4rem)] overflow-y-auto">
      <div className="p-6 w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <KeyIcon className="size-4 text-primary" />
                  <div>
                    <H6 className="text-primary">Password</H6>
                    <p className="text-xs text-secondary-text">
                      Manage your password
                    </p>
                  </div>
                </div>
                {!isChangingPassword && (
                  <Button
                    color="primary"
                    variant="flat"
                    size="sm"
                    onPress={() => setIsChangingPassword(true)}
                  >
                    Change
                  </Button>
                )}
              </div>

              <Divider className="bg-border" />

              {!isChangingPassword ? (
                <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <KeyIcon className="size-4 text-primary" />
                  <div>
                    <p className="font-medium text-primary">
                      Password Protected
                    </p>
                    <p className="text-sm text-secondary-text">
                      Your account is secured with a password
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <InputPassword
                      className="p-4"
                      label="Current Password"
                      value={currentPasswordRef.current?.getValue()}
                      onChange={(e) => currentPasswordRef.current?.setValue(e)}
                      placeholder="Enter current password"
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <InputPassword
                      className="p-4"
                      label="New Password"
                      value={newPasswordRef.current?.getValue()}
                      onChange={(e) => newPasswordRef.current?.setValue(e)}
                      placeholder="Enter new password"
                      size="sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <InputConfirmPassword
                      className="p-4"
                      password={newPasswordRef.current?.getValue() || ''}
                      label="Confirm Password"
                      value={confirmPasswordRef.current?.getValue()}
                      onChange={(e) => confirmPasswordRef.current?.setValue(e)}
                      placeholder="Confirm new password"
                      size="sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button
                      variant="light"
                      size="sm"
                      onPress={handleCancelPasswordChange}
                      isDisabled={isSavingPassword}
                    >
                      Cancel
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      onPress={handleChangePassword}
                      isLoading={isSavingPassword}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:device-phone-mobile"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Two-Factor Authentication</H6>
                  <p className="text-xs text-secondary-text">
                    Add an extra layer of security
                  </p>
                </div>
              </div>

              <Divider className="bg-border" />

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:device-phone-mobile"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="font-medium text-primary">
                        Authenticator App
                      </p>
                      <p className="text-sm text-secondary-text">
                        Not configured
                      </p>
                    </div>
                  </div>
                  <Button variant="flat" color="primary" size="sm" isDisabled>
                    Setup
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-3">
                    <Icon
                      icon="heroicons:envelope"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="font-medium text-primary">
                        Email Verification
                      </p>
                      <p className="text-sm text-secondary-text">
                        Enabled by default
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
                      icon="heroicons:key"
                      className="size-5 text-secondary-text"
                    />
                    <div>
                      <p className="font-medium text-primary">Recovery Codes</p>
                      <p className="text-sm text-secondary-text">
                        Not generated
                      </p>
                    </div>
                  </div>
                  <Button variant="light" color="primary" size="sm" isDisabled>
                    Generate
                  </Button>
                </div>
              </div>

              <div className="p-3 bg-secondary/10 rounded-lg border border-secondary-text">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="heroicons:information-circle"
                    className="size-4 text-secondary-text mt-0.5"
                  />
                  <p className="text-xs text-secondary-text">
                    Two-factor authentication adds an extra layer of security to
                    your account. Coming soon!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Active Sessions */}
        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Icon
                    icon="heroicons:computer-desktop"
                    className="size-5 text-primary"
                  />
                </div>
                <div>
                  <H6 className="text-primary">Active Sessions</H6>
                  <p className="text-xs text-secondary-text">
                    Manage your active sessions across devices
                  </p>
                </div>
              </div>
              <Button
                variant="light"
                color="primary"
                size="sm"
                onPress={() => loadSessions()}
                isLoading={loadingSessions}
              >
                Refresh
              </Button>
            </div>

            <Divider className="bg-border" />

            {loadingSessions ? (
              <div className="text-center py-8 text-secondary-text">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8">
                <Icon
                  icon="heroicons:computer-desktop"
                  className="size-12 text-secondary-text/50 mx-auto mb-3"
                />
                <p className="text-secondary-text">No active sessions found</p>
                <p className="text-xs text-secondary-text mt-1">
                  Click refresh to load your sessions
                </p>
              </div>
            ) : (
              <ScrollShadow size={4} className="overflow-y-scroll max-h-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-fit ">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          icon="heroicons:computer-desktop"
                          className="size-5 text-primary"
                        />
                        <div>
                          <p className="font-medium text-primary">
                            {getBrowserFromUserAgent(session.userAgent)}
                          </p>
                          <p className="text-xs text-secondary-text">
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
              </ScrollShadow>
            )}
          </div>
        </Card>

        <Card className="bg-light border border-border hover:border-border-hover transition-all duration-300">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Icon
                  icon="heroicons:clipboard-document-list"
                  className="size-5 text-primary"
                />
              </div>
              <div>
                <H6 className="text-primary">Security Log</H6>
                <p className="text-xs text-secondary-text">
                  Recent security-related activity
                </p>
              </div>
            </div>

            <Divider className="bg-border" />

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Icon
                  icon="heroicons:arrow-right-on-rectangle"
                  className="size-4 text-success-500"
                />
                <div className="flex-1">
                  <p className="text-sm text-primary">Successful login</p>
                  <p className="text-xs text-secondary-text">Chrome on macOS</p>
                </div>
                <span className="text-xs text-secondary-text">Just now</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Icon icon="heroicons:key" className="size-4 text-primary" />
                <div className="flex-1">
                  <p className="text-sm text-primary">Password changed</p>
                  <p className="text-xs text-secondary-text">
                    Via settings page
                  </p>
                </div>
                <span className="text-xs text-secondary-text">2 days ago</span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                <Icon
                  icon="heroicons:arrow-right-on-rectangle"
                  className="size-4 text-success-500"
                />
                <div className="flex-1">
                  <p className="text-sm text-primary">Successful login</p>
                  <p className="text-xs text-secondary-text">
                    Safari on iPhone
                  </p>
                </div>
                <span className="text-xs text-secondary-text">1 week ago</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
