import { logger } from '@razvan11/paladin';
import { DevMailer } from './DevMailer';
import { PrimaryMailer } from './PrimaryMailer';

export const getMailer = () => {
  if (Bun.env.APP_ENV === 'development' || Bun.env.APP_ENV === 'local') {
    logger.success('Development environment detected');
    return new DevMailer();
  }
  return new PrimaryMailer();
};
