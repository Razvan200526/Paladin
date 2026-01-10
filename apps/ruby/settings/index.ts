// Layout
export { SettingsLayout } from './SettingsLayout';

export {
  AccountPage,
  ProfilePage,
  SecurityPage,
} from './pages';

// Components
export {
  ConfirmChangesCard,
  ConfirmModal,
  SettingsCard,
  SettingsField,
  UserInformation,
} from './components';

// Profile Components
export {
  ProfileAvatarUpload,
  ProfileBio,
  ProfileForm,
  ProfileHeader,
  ProfileLinks,
  ProfilePreferences,
} from './pages/profile/components';

// Hooks
export {
  useUpdateProfile,
  useSessions,
  useRevokeSession,
  useDeleteAccount,
  type SessionType,
} from './hooks';

// Store
export {
  createSettingsStore,
  SETTINGS_STORAGE_KEY,
  type SettingsStoreType,
} from './pages/profile/settingsProfileStore';
