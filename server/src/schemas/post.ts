import * as z from "zod";

export const Post = z.object({
  date: z.date(),
  userId: z.string(),
  title: z.string(),
  content: z.unknown(),
});

export type Post = z.infer<typeof Post>;

export const UpdatedPost = Post.partial();
export type UpdatedPost = z.infer<typeof UpdatedPost>;
