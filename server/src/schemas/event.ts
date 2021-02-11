import * as z from "zod";

export const Event = z.object({
  date: z.date(),
  userId: z.string(),
  title: z.string(),
  description: z.string(),
});

export type Event = z.infer<typeof Event>;

export const UpdatedEvent = Event.partial();
export type UpdatedEvent = z.infer<typeof UpdatedEvent>;
