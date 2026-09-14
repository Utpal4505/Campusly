import { z } from "zod";

export const feedItemTypeSchema = z.enum(["event", "club"]);
export type FeedItemType = z.infer<typeof feedItemTypeSchema>;

export const feedItemSchema = z.object({
  type: feedItemTypeSchema,
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  matchedInterests: z.array(z.string()),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  metadata: z.object({
    date: z.date().or(z.string()).optional(),
    location: z.string().nullable().optional(),
    coverImage: z.string().nullable().optional(),
    logo: z.string().nullable().optional(),
    registrationCount: z.number().optional(),
    memberCount: z.number().optional(),
    creatorName: z.string(),
  }),
});

export type FeedItem = z.infer<typeof feedItemSchema>;

export const feedResponseSchema = z.object({
  items: z.array(feedItemSchema),
  total: z.number(),
  hasPersonalizedResults: z.boolean(),
});

export type FeedResponse = z.infer<typeof feedResponseSchema>;
