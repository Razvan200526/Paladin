import * as z from 'zod';

const passwordSchema = z.object({
  password: z
    .string()
    .min(8)
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
});

export const isUserPasswordValid = (password: string) => {
  try {
    return z.safeParse(passwordSchema, { password }).success;
  } catch (e) {
    console.error(e);
    return false;
  }
};
