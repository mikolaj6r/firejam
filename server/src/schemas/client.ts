import { RoleEnum } from "./role";
import * as z from "zod";

export const CreateClient = z.object({
  disabled: z.boolean(),
  token: z.string().uuid(),
  role: RoleEnum,
});

export type CreateClient = z.infer<typeof CreateClient>;

export const DatabaseClient = z.object({
  disabled: z.boolean(),
  token: z.object({
    salt: z.string(),
    hashedString: z.string(),
  }),
  role: RoleEnum,
});

export type DatabaseClient = z.infer<typeof DatabaseClient>;

export const UpdatedClient = CreateClient.partial();

export type UpdatedClient = z.infer<typeof UpdatedClient>;
