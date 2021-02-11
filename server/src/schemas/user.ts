import * as z from "zod";

export const User = z.object({
  displayName: z.string(),
  email: z.string(),
});

export const CreatedUser = z.object({
  displayName: z.string(),
  email: z.string(),
  password: z.string().regex(/(?=.*[0-9a-zA-Z]).{6,}/),
  role: z.string().optional(),
  disabled: z.boolean().optional(),
  emailVerified: z.boolean().optional(),
});

export type CreatedUser = z.infer<typeof CreatedUser>;

export type User = z.infer<typeof User>;

export const UpdatedUser = User.partial();
export type UpdatedUser = z.infer<typeof UpdatedUser>;
