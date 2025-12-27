/**
 * Controllers Export
 * Central export file for all controllers to be registered with App.registerControllers()
 */

// Analytics Controllers
export { AnalyticsController } from './AnalyticsController';

// Application Controllers
export { ApplicationsController } from './ApplicationsController';
// Auth Controllers
export { AuthController } from './AuthController';
export { CoverlettersController } from './CoverlettersController';
// Jobs Controllers
export { JobsController } from './JobsController';
// Notification Controllers
export { NotificationsController } from './NotificationsController';
// Resource Controllers
export { ResumesController } from './ResumesController';

// User Controllers
export { UsersController } from './UsersController';

import { AnalyticsController } from './AnalyticsController';
import { ApplicationsController } from './ApplicationsController';
// Export all controllers as an array for convenient registration
import { AuthController } from './AuthController';
import { CoverlettersController } from './CoverlettersController';
import { JobsController } from './JobsController';
import { NotificationsController } from './NotificationsController';
import { ResumesController } from './ResumesController';
import { UploadController } from './UploadController';
import { UsersController } from './UsersController';

export const controllers = [
  AuthController,
  ApplicationsController,
  ResumesController,
  CoverlettersController,
  AnalyticsController,
  JobsController,
  NotificationsController,
  UsersController,
  UploadController,
];
