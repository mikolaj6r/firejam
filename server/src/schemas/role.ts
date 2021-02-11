import * as z from "zod";

export const RoleEnum = z.enum([
  "admin",
  "management",
  "client",
  "teacher",
  "public",
]);

export type RoleEnum = z.infer<typeof RoleEnum>;
