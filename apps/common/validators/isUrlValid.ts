import * as z from 'zod';

const urlSchema = z.object({
  url: z.url(),
});

export const isUrlValid = (url: string | undefined) => {
  return urlSchema.safeParse(url).success;
};
