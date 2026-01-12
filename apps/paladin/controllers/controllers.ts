/**
 * Controllers Export
 * Central export file for all controllers to be registered with App.registerControllers()
 */

export { AnalyticsController } from './AnalyticsController';

export { ApplicationsController } from './ApplicationsController';
export { AuthController } from './AuthController';
export { ChatHistoryController } from './ChatHistoryController';
export { CoverlettersController } from './CoverlettersController';
export { JobsController } from './JobsController';
export { NotificationsController } from './NotificationsController';
export { PostHogProxyController } from './PostHogProxyController';
export { ResumeAIController } from './ResumeAIController';
export { ResumeBuilderController } from './ResumeBuilderController';
export { ResumesController } from './ResumesController';
export { UserSessionsController } from './UserSessionsController';
export { UsersController } from './UsersController';

import { AnalyticsController } from './AnalyticsController';
import { ApplicationsController } from './ApplicationsController';
import { AuthController } from './AuthController';
import { ChatHistoryController } from './ChatHistoryController';
import { CoverlettersController } from './CoverlettersController';
import { JobsController } from './JobsController';
import { NotificationsController } from './NotificationsController';
import { PostHogProxyController } from './PostHogProxyController';
import { ResumeAIController } from './ResumeAIController';
import { ResumeBuilderController } from './ResumeBuilderController';
import { ResumesController } from './ResumesController';
import { UploadController } from './UploadController';
import { UserSessionsController } from './UserSessionsController';
import { UsersController } from './UsersController';

export const controllers = [
  AuthController,
  ApplicationsController,
  ResumesController,
  ResumeAIController,
  ResumeBuilderController,
  CoverlettersController,
  ChatHistoryController,
  AnalyticsController,
  JobsController,
  NotificationsController,
  UsersController,
  UploadController,
  UserSessionsController,
  PostHogProxyController,
];
