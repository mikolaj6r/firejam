import * as z from "zod";

export const Page = z.object({
  date: z.date(),
  userId: z.string(),
  title: z.string(),
  content: z.unknown(),
});

export type Page = z.infer<typeof Page>;

export const UpdatedPage = Page.partial();
export type UpdatedPage = z.infer<typeof UpdatedPage>;
