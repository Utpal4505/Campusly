import { z } from "zod";

export const updatePreferencesSchema = z.object({
  interestIds: z.array(z.string()).min(1, "Please select at least one interest"),
});

export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export const userCardSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable().optional(),
  email: z.string().email().optional(),
  image: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  department: z.string().nullable().optional(),
  yearOfStudy: z.number().nullable().optional(),
  createdAt: z.date().or(z.string()),
  interests: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    })
  ),
});

export type UserCard = z.infer<typeof userCardSchema>;

export const userProfileSchema = userCardSchema.extend({});

export type UserProfile = z.infer<typeof userProfileSchema>;
