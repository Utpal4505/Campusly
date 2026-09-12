import { z } from "zod";

export const postCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string().nullable().optional(),
  author: z.object({
    id: z.string(),
    name: z.string(),
  }),
  createdAt: z.date().or(z.string()),
});

export type PostCard = z.infer<typeof postCardSchema>;

export const createPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().optional().nullable(),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
