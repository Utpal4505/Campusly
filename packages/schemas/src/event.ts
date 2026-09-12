import { z } from "zod";

export const eventCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  date: z.date().or(z.string()),
  location: z.string().nullable(),
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
  registrationCount: z.number(),
});

export type EventCard = z.infer<typeof eventCardSchema>;

export const eventDetailSchema = eventCardSchema.extend({
  creator: z.object({
    id: z.string(),
    name: z.string(),
    department: z.string().nullable().optional(),
  }),
});

export type EventDetail = z.infer<typeof eventDetailSchema>;
