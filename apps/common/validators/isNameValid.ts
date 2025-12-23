import * as z from 'zod';

const nameSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-zA-Z\s]+$/);

export const isNameValid = (name: string) => {
  return nameSchema.safeParse(name).success;
};
