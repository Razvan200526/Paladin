import * as z from 'zod';

const fileNameSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9\s\-_]+$/);

export const isFileNameValid = (name: string) => {
  return fileNameSchema.safeParse(name).success;
};
