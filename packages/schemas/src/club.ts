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
  logo: z.string().nullable().optional(),
  coverImage: z.string().nullable().optional(),
  memberCount: z.number(),
});

export type ClubCard = z.infer<typeof clubCardSchema>;

export const clubDetailSchema = clubCardSchema.extend({
  createdAt: z.date().or(z.string()),
});

export type ClubDetail = z.infer<typeof clubDetailSchema>;

export const createClubSchema = z.object({
  name: z.string().min(3, "Club name must be at least 3 characters"),
  description: z.string().optional().nullable(),
  logo: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  interestIds: z.array(z.string()).optional(),
  interestNames: z.array(z.string()).optional(),
});

export type CreateClubInput = z.infer<typeof createClubSchema>;
