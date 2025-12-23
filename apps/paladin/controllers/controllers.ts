/**
 * Controllers Export
 * Central export file for all controllers to be registered with App.registerControllers()
 */

// Auth Controllers
export { AuthController } from './AuthController';

// Application Controllers
export { ApplicationsController } from './ApplicationsController';

// Resource Controllers
export { ResumesController } from './ResumesController';
export { CoverlettersController } from './CoverlettersController';

// Analytics Controllers
export { AnalyticsController } from './AnalyticsController';

// Jobs Controllers
export { JobsController } from './JobsController';

// Notification Controllers
export { NotificationsController } from './NotificationsController';

// User Controllers
export { UsersController } from './UsersController';

// Export all controllers as an array for convenient registration
import { AuthController } from './AuthController';
import { ApplicationsController } from './ApplicationsController';
import { ResumesController } from './ResumesController';
import { CoverlettersController } from './CoverlettersController';
import { AnalyticsController } from './AnalyticsController';
import { JobsController } from './JobsController';
import { NotificationsController } from './NotificationsController';
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
];
