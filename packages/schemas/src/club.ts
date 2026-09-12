import { z } from "zod";

export const clubCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  creator: z.object({
    id: z.string(),
    name: z.string(),
  }),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
  memberCount: z.number(),
});

export type ClubCard = z.infer<typeof clubCardSchema>;

export const clubDetailSchema = clubCardSchema.extend({
  createdAt: z.date().or(z.string()),
});

export type ClubDetail = z.infer<typeof clubDetailSchema>;
