import { ErrorFallback } from '@common/components/pages/ErrorFallback';
import { NotFoundPage } from '@common/components/pages/NotFoundPage';
import { ApplicationsLayout } from '@ruby/applications/layout/ApplicationsLayout';
import { ApplicationInspectPage } from '@ruby/applications/pages/ApplicationInspectPage';
import { ApplicationPage } from '@ruby/applications/pages/ApplicationPage';
import { EditApplicationPage } from '@ruby/applications/pages/EditApplicationPage';
import { AskAiPage } from '@ruby/ask/AskAiPage';
import { DashboardLayout } from '@ruby/dashboard/DashboardLayout';
import { HeroPage } from '@ruby/hero/HeroPage';
import { JobsPage } from '@ruby/jobs';
import { ForgotPasswordPage } from '@ruby/reset-password/ForgotPasswordPage';
import { CoverLettersPage } from '@ruby/resources/cover-letter/pages/CoverLettersPage';
import { CoverLetterInspectPage } from '@ruby/resources/cover-letter/pages/CoverletterInspectPage';
import { FeatureNotImplemented } from '@ruby/resources/FeatureNotImplementedYet';
import { ResourceLayout } from '@ruby/resources/ResourceLayout';
import { ResumeBuilderPage } from '@ruby/resources/resumes/builder/ResumeBuilderPage';
import { ResumeInspectPage } from '@ruby/resources/resumes/ResumeInspectPage';
import { ResumePage } from '@ruby/resources/resumes/ResumePage';
import { AccountPage, ProfilePage, SecurityPage } from '@ruby/settings/pages';
import { SettingsLayout } from '@ruby/settings/SettingsLayout';
import { AuthLayout } from '@ruby/shared/components/layout/AuthLayout';
import { SigninPage } from '@ruby/signin/SignInPage';
import { SignupPage } from '@ruby/signup/SignUpPage';
import { ErrorBoundary } from 'react-error-boundary';
import { createBrowserRouter, Outlet } from 'react-router';
export const ErrorBoundaryLayout = () => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Outlet />
  </ErrorBoundary>
);

export const router = createBrowserRouter([
  {
    element: <ErrorBoundaryLayout />,
    children: [
      {
        path: '/',
        element: <HeroPage />,
      },
      {
        path: '/signin',
        element: <SigninPage />,
      },
      {
        path: '/reset-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/signup',
        element: <SignupPage />,
      },
      {
        path: '/home',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            path: 'dashboard',
            element: <DashboardLayout />,
          },
          {
            path: 'ask',
            element: <AskAiPage />,
          },
          {
            path: 'jobs',
            element: <JobsPage />,
          },
          {
            path: 'resources',
            element: <ResourceLayout />,
            children: [
              {
                index: true,
                element: <ResumePage />,
              },
              {
                path: 'coverletter',
                element: <CoverLettersPage />,
              },
              {
                path: 'coverletters/:id',
                element: <CoverLetterInspectPage />,
              },
              {
                path: 'chats',
                element: <FeatureNotImplemented />,
              },
              {
                path: 'resumes/builder',
                element: <ResumeBuilderPage />,
              },
              {
                path: 'resumes/builder/:id',
                element: <ResumeBuilderPage />,
              },
              {
                path: 'resumes/:id',
                element: <ResumeInspectPage />,
              },
            ],
          },

          {
            path: 'settings',
            element: <SettingsLayout />,
            children: [
              {
                index: true,
                element: <ProfilePage />,
              },
              {
                path: 'account',
                element: <AccountPage />,
              },
              {
                path: 'security',
                element: <SecurityPage />,
              },
            ],
          },
          {
            path: 'applications',
            element: <ApplicationsLayout />,
            children: [
              {
                path: '',
                element: <ApplicationPage />,
              },
              {
                path: ':id',
                element: <ApplicationInspectPage />,
              },
              {
                path: 'edit/:id',
                element: <EditApplicationPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
